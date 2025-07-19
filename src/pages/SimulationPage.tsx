// src/pages/SimulationPage.tsx
import React, { useState, useEffect, CSSProperties } from 'react';
import styled from 'styled-components';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import HtmlRenderer from '../components/utils/HtmlRenderer'; // 1. Import the new component
import { useDebounce } from 'use-debounce';
import { useUser } from '../context/UserContext';

// HELPERS

// --- Helper function ---
const formatParagraphs = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return "";
  }

  // Regex to find URLs (http, https, or www domains)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  return text
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      // Find and replace URLs within the line with <a> tags
      const lineWithLinks = line.replace(urlRegex, (url) => {
        // Prepend 'http://' to www links for them to work correctly
        const href = url.startsWith('www.') ? `http://${url}` : url;
        // Return the HTML link tag
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      });
      // Wrap the entire processed line in a <p> tag
      return `<p>${lineWithLinks}</p>`;
    })
    .join('');
};

// --- Type Definitions ---
type Question = {
  answer: string[];
  options: string[];
  question: string;
  explanation: string;
  question_number: string;
  why_incorrect?: string;
  references?: string;
};
type Topic = { questions: Question[]; case_study?: string; topic_name?: string; };
type SimulationData = { fileName: string; topics: Record<string, Topic>; };
type SupabaseFile = { 'ai-parsed-data': { result: { topics: Record<string, Topic>; }; }; filename: string; };
type StructuredItem = { type: 'question'; content: Question; parent?: { topic?: string | undefined; caseStudyTitle?: string | undefined; caseStudyDescription?: string | undefined; caseStudyQuestionsCount?: number | undefined; } };
// --- SVG Icons ---
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159L11.5 12.5L12.5 11.5L10.0158 9.30885C9.42248 9.75587 8.68594 10.0345 7.89932 10.0883L6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5C10 7.50556 9.61334 8.42373 9.00001 9.13098L9.30884 10.0159Z" fill="#757575"></path></svg>;
const IconDownload = () => <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H2V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H11V12H4V6ZM7.5 10L11 5H8V2H7V5H4L7.5 10Z" fill="currentColor"></path></svg>;
const IconEye = () => <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 11C4.79322 11 2.49241 9.2993 1.05532 7.50001C2.49241 5.70072 4.79322 4 7.5 4C10.2068 4 12.5076 5.70072 13.9447 7.50001C12.5076 9.2993 10.2068 11 7.5 11ZM7.5 3C4.33776 3 1.68988 5.00373 0.160645 6.88398L0.116041 6.94165C-0.0386803 7.14378 -0.0386803 7.85624 0.116041 8.05837L0.160645 8.11604C1.68988 9.99629 4.33776 12 7.5 12C10.6622 12 13.3101 9.99629 14.8394 8.11604L14.884 8.05837C15.0387 7.85624 15.0387 7.14378 14.884 6.94165L14.8394 6.88398C13.3101 5.00373 10.6622 3 7.5 3ZM7.5 9C6.40237 9 5.50655 8.11289 5.5 7.00001C5.50655 5.88713 6.40237 5.00001 7.5 5.00001C8.59763 5.00001 9.49345 5.88713 9.5 7.00001C9.49345 8.11289 8.59763 9 7.5 9Z" fill="currentColor"></path></svg>;
const IconEyeSlash = () => <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.3415 13.6585L13.6582 1.34176L12.9511 0.634691L0.634433 12.9514L1.3415 13.6585ZM4.39893 9.60107C3.13626 8.87784 2.15372 7.84628 1.05532 7.5C2.49241 5.70072 4.79322 4 7.5 4C8.61439 4 9.66427 4.29891 10.584 4.80878L9.49989 6.00001C9.49561 5.92548 9.24345 5.88713 9.5 7C9.49345 8.11289 8.59763 9 7.5 9C6.81406 9 6.20237 8.68594 5.86902 8.13098L4.39893 9.60107ZM14.8394 6.88398C13.5936 5.25338 11.6622 3 7.5 3C6.59763 3 5.75655 3.20237 5.00001 3.55837L6.50001 5C6.40237 5 5.50655 5.88713 5.5 7C5.50655 7.24345 5.57452 7.46548 5.68988 7.68988L7.584 9.584C8.75655 9.42548 9.49345 8.49345 9.5 7.41594L13.8839 12.8394C14.4934 12.1129 14.8394 11.2434 14.8394 10.5C14.8394 9.99629 13.3101 8.11604 14.884 8.05837C15.0387 7.85624 15.0387 7.14378 14.884 6.94165L14.8394 6.88398Z" fill="currentColor"></path></svg>;
const IconTopicFolder = ({ style = {} }: { style?: CSSProperties }) => <svg style={style} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5C3 4.44772 3.44772 4 4 4H9.17157C9.58052 4 9.91096 4.24065 10.0607 4.58579L10.5858 5.75736C10.7355 6.1025 11.0659 6.34315 11.4749 6.34315H20C20.5523 6.34315 21 6.79086 21 7.34315V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V5Z" fill="#000000" fillOpacity="0.7" /></svg>;
const IconCaseStudy = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20V20H4V4ZM3 3V21H21V3H3ZM6 6H18V8H6V6ZM6 10H18V12H6V10ZM6 14H14V16H6V14Z" fill="#673AB7"></path></svg>;
const IconArrowBack = ({ style = {} }: { style?: CSSProperties }) => <svg style={style} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L1.64645 7.35355C1.45118 7.15829 1.45118 6.84171 1.64645 6.64645L6.14645 2.14645C6.34171 1.95118 6.65829 1.95118 6.85355 2.14645Z" fill="currentColor" /></svg>;
const IconArrowForward = ({ style = {} }: { style?: CSSProperties }) => <svg style={style} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 3.34171 8.34171 3.65829 8.14645 3.85355L4.99999 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H5L8.14645 11.1464C8.34171 11.3417 8.34171 11.6583 8.14645 11.8536C7.95118 12.0488 7.6346 12.0488 7.43934 11.8536L2.93934 7.35355C2.74408 7.15829 2.74408 6.84171 2.93934 6.64645L7.43934 2.14645C7.6346 1.95118 7.95118 1.95118 8.14645 2.14645Z" fill="currentColor" transform="scale(-1,1) translate(-15,0)" /></svg>;

// --- Helper function ---
const flattenItems = (topics: Record<string, Topic>): { type: string; content: any }[] => {
  const flatList: { type: string; content: any }[] = [];
  Object.entries(topics).forEach(([topicKey, topic]: [string, Topic]) => {
    if (topic.topic_name) {
      flatList.push({ type: 'topic', content: { title: topic.topic_name, caseStudyCount: topic.case_study ? 1 : 0 } });
    }
    if (topic.case_study) {
      flatList.push({ type: 'case_study', content: { title: topic.topic_name || topicKey, description: topic.case_study, questionsCount: topic.questions?.length || 0 } });
    }
    (topic.questions || []).forEach((q: Question, qIndex: number) => {
      flatList.push({ type: 'question', content: { ...q, question_number: q.question_number || (qIndex + 1).toString() } });
    });
  });
  return flatList;
};

// --- Styled Components (Full Definitions) ---
const PageContainer = styled.div` display: flex; flex-direction: column; gap: 16px; `;
const HeaderContainer = styled.div`
  @media (min-width: 651px) { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 16px; }
  @media (max-width: 650px) { display: flex; flex-direction: column; gap: 16px; }
`;
const FileName = styled.h2` color: #2c2c54; font-weight: bold; font-size: 22px; `;
const HeaderActions = styled.div` display: flex; align-items: center; gap: 12px; `;

const DownloadButtonText = styled.span`
  display: inline;
  @media (max-width: 650px) {
    display: none;
  }
`;

const ViewToggle = styled.div`
  display: flex; align-items: center; gap: 4px; padding: 4px 8px; background-color: white; border: 1px solid #E0E0E0; border-radius: 12px;
  span { font-weight: bold; color: #757575; }
  svg { color: #757575; }
`;
const Switch = styled.input.attrs({ type: 'checkbox' })`
  appearance: none; width: 34px; height: 20px; background: #E0E0E0; border-radius: 10px; position: relative; cursor: pointer;
  &:checked { background: #673AB7; }
  &::before { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: 0.2s; }
  &:checked::before { left: 16px; }
`;
const GoToButton = styled.button`
  background: none; border: 1px solid #E0E0E0; padding: 8px 12px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: bold; color: #757575;
`;
const DownloadButton = styled.button`
  background-color: #673AB7; color: white; border: none; border-radius: 12px; padding: 10px 16px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px;
  @media (max-width: 650px) { padding: 12px; border-radius: 50%; }
`;
const GoToFieldContainer = styled.div<{ $show: boolean }>`
  height: ${({ $show }) => $show ? '60px' : '0'}; display: flex; justify-content: center; align-items: center; gap: 8px; overflow: hidden; transition: height 0.3s;
`;
const GoToInput = styled.input` width: 150px; text-align: center; border: 1px solid #E0E0E0; border-radius: 8px; padding: 8px; `;
const GoButton = styled.button` background-color: #673AB7; color: white; border: none; padding: 8px 16px; border-radius: 8px; `;
const ContentContainer = styled.div` background-color: white; border-radius: 12px; border: 1px solid #E0E0E0; `;
const TopicHeader = styled.div` padding: 24px 16px 16px; display: flex; align-items: center; gap: 16px; font-size: 20px; font-weight: bold; color: #424242; span { font-weight: 500; } `;
const CaseStudyContainer = styled.div` background-color: rgba(239, 234, 254, 0.4); border-bottom: 1px solid rgba(103, 58, 183, 0.2); padding: 26px; `;
const CaseStudyHeader = styled.div` display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: bold; color: #673AB7; @media (max-width: 500px) { flex-direction: column; align-items: flex-start; } `;
const CaseStudyLabel = styled.p` color: #BDBDBD; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; `;
const CaseStudyQuestions = styled.span` font-size: 14px; font-weight: 500; color: #757575; `;
const CaseStudyToggle = styled.button` background: none; border: none; color: #673AB7; font-weight: bold; display: flex; align-items: center; gap: 4px; cursor: pointer; `;
const CaseStudyContent = styled.div<{ $expanded: boolean }>`
  max-height: ${({ $expanded }) => $expanded ? 'none' : '50px'}; overflow: hidden; transition: max-height 0.3s; 
`;
const HideButtonBottom = styled.button` position: absolute; bottom: 10px; right: 10px; background: none; border: none; color: #673AB7; font-weight: bold; display: flex; align-items: center; gap: 4px; cursor: pointer; `;
const QuestionCardContainer = styled.div` padding: 26px; `;
const QuestionHeader = styled.div` @media (min-width: 601px) { display: flex; align-items: flex-start; gap: 18px; } @media (max-width: 600px) { display: flex; flex-direction: column; gap: 16px; } `;
const QuestionNumber = styled.div` background-color: rgba(103, 58, 183, 0.12); color: #673AB7; font-weight: bold; font-size: 16px; padding: 12px; border-radius: 10px; `;
const Label = styled.p` color:rgb(131, 129, 131); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; margin-top: 20px; @media (min-width: 601px) { padding-left: 1px; } @media (max-width: 600px) { padding-left: 0; } `; const OptionsList = styled.div` display: flex; flex-direction: column; gap: 11px; @media (min-width: 601px) { padding-left: 1px; } @media (max-width: 600px) { padding-left: 0; } `;
// This is the only change you need

const OptionItem = styled.div<{ $isCorrect: boolean }>`
  display: flex;
 align-items: baseline;
  gap: 8px;
  border: 1px solid ${({ $isCorrect }) => $isCorrect ? '#38b000' : '#E0E0E0'};
  background: ${({ $isCorrect }) => $isCorrect ? '#F4FBF6' : 'transparent'};
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 15px;
  line-height: 1.35;
  transition: all 0.14s;
  box-shadow: ${({ $isCorrect }) => $isCorrect ? '0 2px 6px rgba(56,176,0,0.1)' : 'none'};
`;
const ActionButtons = styled.div` display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 26px; `;
const PrimaryButton = styled.button` border: none; background-color: #673AB7; color: white; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 500; `;
const CorrectAnswerSection = styled.div` display: flex; align-items: center; gap: 8px; padding: 12px 0; @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 16px; } `;
const CorrectLabel = styled.span`
  display: block; /* ✅ Stacks the elements vertically */
  color:rgb(0, 0, 0);
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 5px;
`;

const CorrectText = styled.span`
  font-weight: regular;
  font-size: 15px;
`;
const ExplanationSection = styled.div` margin-top: 8px; `;
const PaginationContainer = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background-color: white; border: 1px solid #E0E0E0; border-radius: 12px; `;
const PageButton = styled.button` background: none; border: 1px solid #E0E0E0; color: #333; padding: 8px 16px; border-radius: 8px; cursor: pointer; &:disabled { cursor: not-allowed; opacity: 0.5; } `;
const LoadingContainer = styled.div` display: flex; justify-content: center; align-items: center; height: 300px; font-size: 18px; color: #757575;`;
const PaginationText = styled.span` color: #757575; font-weight: 500; `;

// --- The Main Page Component ---

// STATE HOOKS

const SimulationPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [structuredItems, setStructuredItems] = useState<StructuredItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSingleView, setIsSingleView] = useState(true);
  const [showGoToField, setShowGoToField] = useState(false);
  const [goToInput, setGoToInput] = useState('');
  const [showAnswersMap, setShowAnswersMap] = useState<Record<string, boolean>>({});
  const { user } = useUser();
  const location = useLocation();
  const [multiViewPage, setMultiViewPage] = useState(1);
  const startIndex = location.state?.startIndex;
  const [debouncedIndex] = useDebounce(currentIndex, 1500); // Saves 1.5s after user stops
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "", href: null as string | null });

  const handleReferenceLinkClick = (href: string) => {
    setAlertInfo({
      isOpen: true,
      href: href, // Store the link to open
      message: "You are accessing a reference link. Before you move out, please remember that platforms keep changing their URLs for such documents, and by the time you click it, it might have changed. In case the link is broken or returns a \"Not Found,\" error, the best way is to search the reference doc online. Thank you."
    });
  };

  const handleAlertConfirm = () => {
    // This function runs when "OK" is clicked.
    if (alertInfo.href) {
      // This method is more likely to open a new tab instead of a new window.
      const link = document.createElement('a');
      link.href = alertInfo.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
    // Close the modal
    setAlertInfo({ isOpen: false, message: "", href: null });
  };

  useEffect(() => {
    if (!fileId) return;
    async function getSimulationData() {
      setLoading(true);
      const { data, error } = await supabase.from('files').select('filename, ai-parsed-data').eq('id', fileId).single<SupabaseFile>();
      if (error) {
        console.error("Error fetching file:", error);
      } else if (data && data['ai-parsed-data']?.result?.topics) {
        const topics = data['ai-parsed-data'].result.topics;
        setSimulationData({ fileName: data.filename, topics: topics });
        const newStructuredItems: StructuredItem[] = [];
        let globalQNum = 1;
        Object.values(topics).forEach((topic: Topic) => {
          (topic.questions || []).forEach((q: Question) => {
            newStructuredItems.push({
              type: 'question',
              content: { ...q, question_number: (globalQNum++).toString() },
              parent: { topic: topic.topic_name, caseStudyTitle: topic.case_study ? topic.topic_name : undefined, caseStudyDescription: topic.case_study ? topic.case_study : undefined, caseStudyQuestionsCount: topic.case_study ? (topic.questions?.length || 0) : 0 }
            });
          });
        });
        setStructuredItems(newStructuredItems);
        if (startIndex && startIndex > 0 && startIndex < newStructuredItems.length) {
          setCurrentIndex(startIndex);
        }
      }

      setLoading(false);
    }
    getSimulationData();
  }, [fileId, startIndex]);

  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  // --- This entire block is new ---
  useEffect(() => {
    const saveProgress = async () => {
      // Use the user object directly from your context
      if (!user || !fileId || !simulationData || structuredItems.length === 0) {
        return;
      }

      const { error } = await supabase.from('user_progress').upsert({
        // This now sends the correct numeric WordPress ID
        user_id: user.id,
        last_viewed_file_id: fileId,
        product_name: simulationData.fileName,
        last_viewed_question_index: debouncedIndex,
        total_questions: structuredItems.length,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Supabase error saving progress:", error);
      }
    };

    // Only save if the user has actually navigated to a question
    saveProgress();

  }, [debouncedIndex, user, fileId, simulationData, structuredItems.length]); // Dependencies

  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswersMap({});
    setShowAnswer(false);
    setMultiViewPage(1);
  }, [isSingleView]);

  const handleNext = () => setCurrentIndex(prev => Math.min(prev + 1, structuredItems.length - 1));
  const handlePrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  const currentItem = structuredItems[currentIndex];

  if (isLoading) return <LoadingContainer>Loading Simulation...</LoadingContainer>;
  if (!currentItem) return <LoadingContainer>Could not load questions for this file.</LoadingContainer>;

  // ✅ CALCULATE PAGINATION FOR MULTI-VIEW
  const itemsPerPage = 25;
  const allMultiViewItems = flattenItems(simulationData?.topics || {});
  const totalMultiViewPages = Math.ceil(allMultiViewItems.length / itemsPerPage);
  // Get the 25 items for the current page
  const paginatedMultiViewItems = allMultiViewItems.slice(
    (multiViewPage - 1) * itemsPerPage,
    multiViewPage * itemsPerPage
  );

  return (
    <PageContainer>
      <HeaderContainer>
        <FileName title={simulationData?.fileName}>{simulationData?.fileName}</FileName>
        <HeaderActions>
          <ViewToggle>
            <span>View:</span>
            <IconTopicFolder style={{ color: !isSingleView ? '#673AB7' : '#757575', width: 20, height: 20 }} />
            <Switch checked={isSingleView} onChange={(e) => setIsSingleView(e.target.checked)} />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: isSingleView ? '#673AB7' : '#757575' }}><path d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM4 16H20V18H4V16Z" fill="currentColor" /></svg>
          </ViewToggle>
          <GoToButton onClick={() => setShowGoToField(!showGoToField)}>
            <IconSearch /> Go To
          </GoToButton>
          <DownloadButton onClick={() => { /* ... */ }}>
            <IconDownload />
            <DownloadButtonText>Download</DownloadButtonText>
          </DownloadButton>
        </HeaderActions>
      </HeaderContainer>

      <GoToFieldContainer $show={showGoToField}>
        <GoToInput type="number" value={goToInput} onChange={(e) => setGoToInput(e.target.value)} placeholder="Go to..." />
        <GoButton onClick={() => {
          const target = parseInt(goToInput);
          if (target >= 1 && target <= structuredItems.length) {
            setCurrentIndex(target - 1);
            setIsSingleView(true);
            setShowGoToField(false);
            setGoToInput('');
          } else {
            alert(`Enter a number between 1 and ${structuredItems.length}`);
          }
        }}>Go</GoButton>
      </GoToFieldContainer>

      <ContentContainer>
        {isSingleView ? (
          // --- Single View (no changes here) ---
          <>
            {currentItem.parent?.topic && (
              <TopicHeader>
                <IconTopicFolder />
                <div>
                  <span>Topic: </span>{currentItem.parent.topic}
                  {currentItem.parent?.caseStudyDescription && <div style={{ fontSize: 14, color: '#757575' }}>Case Studies: 1</div>}
                </div>
              </TopicHeader>
            )}
            {currentItem.parent?.caseStudyTitle && <RenderCaseStudy caseStudy={{ title: currentItem.parent.caseStudyTitle || 'Case Study', description: currentItem.parent.caseStudyDescription || '', questionsCount: currentItem.parent.caseStudyQuestionsCount ?? 0 }} />}
            <RenderQuestion
              question={currentItem.content}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              onLinkClick={handleReferenceLinkClick}
            />
          </>
        ) : (
          // --- ✅ MODIFIED MULTI-VIEW WITH PAGINATION ---
          <>
            {/* Map over the paginated list, not the full list */}
            {paginatedMultiViewItems.map((item, index) => (
              <div key={index}>
                {item.type === 'topic' && (
                  <TopicHeader>
                    <IconTopicFolder />
                    <div>
                      <span>Topic: </span>{item.content.title}
                      {item.content.caseStudyCount > 0 && <div style={{ fontSize: 14, color: '#757575' }}>Case Studies: {item.content.caseStudyCount}</div>}
                    </div>
                  </TopicHeader>
                )}
                {item.type === 'case_study' && <RenderCaseStudy caseStudy={item.content} />}
                {item.type === 'question' && (
                  <RenderQuestion
                    question={item.content}
                    showAnswer={showAnswersMap[item.content.question_number] || false}
                    setShowAnswer={(newVal: boolean) => setShowAnswersMap(prev => ({ ...prev, [item.content.question_number]: newVal }))}
                    onLinkClick={handleReferenceLinkClick}
                  />
                )}
              </div>
            ))}
            {/* Pagination controls for multi-view */}
            {totalMultiViewPages > 1 && (
              <PaginationContainer>
                <PaginationText>Page {multiViewPage} of {totalMultiViewPages}</PaginationText>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <PageButton onClick={() => setMultiViewPage(p => Math.max(1, p - 1))} disabled={multiViewPage === 1}>
                    <IconArrowBack />
                  </PageButton>
                  <PageButton onClick={() => setMultiViewPage(p => Math.min(totalMultiViewPages, p + 1))} disabled={multiViewPage === totalMultiViewPages}>
                    <IconArrowForward />
                  </PageButton>
                </div>
              </PaginationContainer>
            )}
          </>
        )}
      </ContentContainer>

      <PaginationContainer>
        <PaginationText>Question {isSingleView ? currentItem.content.question_number : 'Page View'} of {structuredItems.length}</PaginationText>
        <div style={{ display: 'flex', gap: '8px' }}>
          <PageButton onClick={handlePrev} disabled={currentIndex === 0} style={{ color: currentIndex === 0 ? '#757575' : '#673AB7' }}><IconArrowBack /></PageButton>
          <PageButton onClick={handleNext} disabled={currentIndex === structuredItems.length - 1} style={{ color: currentIndex === structuredItems.length - 1 ? '#757575' : '#673AB7' }}><IconArrowForward /></PageButton>
        </div>
      </PaginationContainer>
      <AlertModal
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        onConfirm={handleAlertConfirm}
      />
    </PageContainer>
  );
};

const RenderCaseStudy = ({ caseStudy }: { caseStudy: { title: string; description: string; questionsCount: number } }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <CaseStudyContainer>
      <CaseStudyHeader>
        <IconCaseStudy />
        <div style={{ flex: 1 }}>
          <CaseStudyLabel>Case Study</CaseStudyLabel>
          {caseStudy.title}
        </div>
        <CaseStudyQuestions>Questions: {caseStudy.questionsCount}</CaseStudyQuestions>
        <CaseStudyToggle onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide' : 'Show'} {expanded ? <IconArrowBack style={{ transform: 'rotate(90deg)' }} /> : <IconArrowForward style={{ transform: 'rotate(90deg)' }} />}
        </CaseStudyToggle>
      </CaseStudyHeader>
      <div style={{ position: 'relative' }}>
        <CaseStudyContent $expanded={expanded}>
          <HtmlRenderer htmlString={caseStudy.description} />
        </CaseStudyContent>
        {expanded && (
          <HideButtonBottom onClick={() => setExpanded(false)}>
            Hide <IconArrowBack style={{ transform: 'rotate(90deg)' }} />
          </HideButtonBottom>
        )}
      </div>
    </CaseStudyContainer>
  );
};


const AlertModal = ({
  isOpen,
  message,
  onConfirm, // 👈 Change onClose to onConfirm
}: {
  isOpen: boolean;
  message: string;
  onConfirm: () => void; // 👈 Change the prop name and type
}) => {
  if (!isOpen) return null;

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    textAlign: 'center',
    lineHeight: 1.6
  };

  return (
    <div style={modalStyle} onClick={onConfirm}> {/* Close on background click */}
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button
          onClick={onConfirm} // 👈 Use onConfirm here
          style={{
            marginTop: '20px',
            padding: '10px 24px',
            border: 'none',
            backgroundColor: '#673AB7',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};


const RenderQuestion = ({
  question,
  showAnswer,
  setShowAnswer,
  onLinkClick,
}: {
  question: any; // Accept "any" for robust fallback
  showAnswer: boolean;
  setShowAnswer: (val: boolean) => void;
  onLinkClick: (href: string) => void;
}) => {

  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      e.preventDefault(); // Still prevent the default to call our custom handler
      const href = target.getAttribute('href');
      if (href) {
        onLinkClick(href); // 👈 Use the prop to call the function in the parent
      }
    }
  };

  // Defensive extraction with fallback
  const answerArray = Array.isArray(question.answer)
    ? question.answer
    : typeof question.answer === "string" && question.answer.length
      ? [question.answer]
      : [];
  const optionsArray = Array.isArray(question.options)
    ? question.options
    : typeof question.options === "string" && question.options.length
      ? [question.options]
      : [];

  // Correct answer display string
  const correctLetters = answerArray.join(", ");

  // Extra fields (handle snake_case and camelCase)
  const explanation =
    typeof question.explanation === "string"
      ? question.explanation
      : "";
  const whyIncorrect =
    typeof question.why_incorrect === "string"
      ? question.why_incorrect
      : typeof question.whyIncorrect === "string"
        ? question.whyIncorrect
        : "";
  // References may be array or string
  let references = question.references ?? question.References ?? "";
  if (Array.isArray(references)) references = references.join("\n");
  references = typeof references === "string" ? references : "";

  // "Has" checkers
  const hasExplanation = explanation.trim() !== "";
  const hasWhyIncorrect = whyIncorrect.trim() !== "";
  const hasReferences = references.trim() !== "";


  return (
    <QuestionCardContainer
      style={{
        background: showAnswer
          ? "linear-gradient(to bottom, rgba(239,234,254,0.15) 60%, white)"
          : "white",
        borderRadius: 18,
        boxShadow: "0 5px 15px rgba(103,58,183,0.04)",
        marginBottom: 24,
      }}
    >
      <QuestionHeader>
        <QuestionNumber>Q: {question.question_number || question.id || ""}</QuestionNumber>
        <div style={{ flex: 1 }}>
          <HtmlRenderer htmlString={typeof question.question === "string" ? question.question : ""} />
        </div>
      </QuestionHeader>

      {optionsArray.length > 0 && <Label>Options</Label>}
      <OptionsList>
        {optionsArray.map((opt: string, index: number) => {
          const letter = String.fromCharCode(65 + index);
          // Prepare all possible representations of the answer
          const answerSet = new Set(
            answerArray
              .flatMap((a: string) => a.split(/,\s*/)) // Splits "A, C" into ["A", "C"]
              .map((a: string) => a.trim().toUpperCase())
          );          // Compare by letter ("A", "B", etc)
          const letterIsCorrect = answerSet.has(letter.toUpperCase());
          // Compare by text (full option value, stripped and uppercased)
          const valueIsCorrect =
            answerSet.has(opt.trim().toUpperCase()) ||
            answerSet.has(opt.trim());
          // Highlight if either matches
          const isCorrect = showAnswer && (letterIsCorrect || valueIsCorrect);

          return (
            <OptionItem key={index} $isCorrect={isCorrect}>
              <b>{letter}: </b>
              <span style={{ display: "inline" }}>
                <HtmlRenderer htmlString={typeof opt === "string" ? opt.replace(/^[A-Z][.)]\s*/, "") : ""} />
              </span>
            </OptionItem>
          );
        })}
      </OptionsList>

      <ActionButtons>
        <PrimaryButton onClick={() => setShowAnswer(!showAnswer)}>
          <>
            {showAnswer ? <IconEyeSlash /> : <IconEye />}{" "}
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </>
        </PrimaryButton>
      </ActionButtons>

      {showAnswer && (
        <>
          <div style={{ borderTop: "1.1px solid #E0E0E0", margin: "32px 0" }} />
          <CorrectAnswerSection>
            <div>
              <CorrectLabel>Correct Answer:</CorrectLabel>{" "}
              <CorrectText>{correctLetters}</CorrectText>
            </div>
            {/*         <ReportButton
              style={{ marginLeft: "auto" }}
              onClick={() => alert("Report answer submitted")}
            >
              <IconWarning /> Report Answer as Incorrect
            </ReportButton>

                                              */}

          </CorrectAnswerSection>

          {hasExplanation && (
            <ExplanationSection>
              <Label>Explanation</Label>
              <HtmlRenderer htmlString={explanation} />
              <div style={{ textAlign: "right", marginTop: 10 }}>

              </div>
            </ExplanationSection>
          )}

          {hasWhyIncorrect && (
            <ExplanationSection>
              <Label>Why Incorrect Options are Wrong</Label>
              <HtmlRenderer htmlString={formatParagraphs(whyIncorrect)} />
            </ExplanationSection>
          )}

          {hasReferences && (
            // 👇 And attach handler here
            <ExplanationSection onClick={handleLinkClick}>
              <Label>References</Label>
              <HtmlRenderer htmlString={formatParagraphs(references)} />
            </ExplanationSection>
          )}
        </>
      )}
    </QuestionCardContainer>
  );
};




export default SimulationPage;