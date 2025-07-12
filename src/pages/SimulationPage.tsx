// src/pages/SimulationPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import HtmlRenderer from '../components/utils/HtmlRenderer'; // 1. Import the new component


// --- SVG Icons ---
//const IconMagnifyingGlass = () => <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159L11.5 12.5L12.5 11.5L10.0158 9.30885C9.42248 9.75587 8.68594 10.0345 7.89932 10.0883L6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5C10 7.50556 9.61334 8.42373 9.00001 9.13098L9.30884 10.0159Z" fill="#757575"></path></svg>;
//const IconFlag = () => <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 14.5V4.5H12.5L9.5 7L12.5 9.5H4.5ZM3 3.5H14V10.5L10 7.5L14 4.5H4V14.5H3V3.5Z" fill="currentColor"></path></svg>;
//const IconDownload = () => <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H2V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H11V12H4V6ZM7.5 10L11 5H8V2H7V5H4L7.5 10Z" fill="currentColor"></path></svg>;
//const IconEye = () => <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 11C4.79322 11 2.49241 9.2993 1.05532 7.50001C2.49241 5.70072 4.79322 4 7.5 4C10.2068 4 12.5076 5.70072 13.9447 7.50001C12.5076 9.2993 10.2068 11 7.5 11ZM7.5 3C4.33776 3 1.68988 5.00373 0.160645 6.88398L0.116041 6.94165C-0.0386803 7.14378 -0.0386803 7.85624 0.116041 8.05837L0.160645 8.11604C1.68988 9.99629 4.33776 12 7.5 12C10.6622 12 13.3101 9.99629 14.8394 8.11604L14.884 8.05837C15.0387 7.85624 15.0387 7.14378 14.884 6.94165L14.8394 6.88398C13.3101 5.00373 10.6622 3 7.5 3ZM7.5 9C6.40237 9 5.50655 8.11289 5.5 7.00001C5.50655 5.88713 6.40237 5.00001 7.5 5.00001C8.59763 5.00001 9.49345 5.88713 9.5 7.00001C9.49345 8.11289 8.59763 9 7.5 9Z" fill="currentColor"></path></svg>;
//const IconEyeSlash = () => <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.3415 13.6585L13.6582 1.34176L12.9511 0.634691L0.634433 12.9514L1.3415 13.6585ZM4.39893 9.60107C3.13626 8.87784 2.15372 7.84628 1.05532 7.5C2.49241 5.70072 4.79322 4 7.5 4C8.61439 4 9.66427 4.29891 10.584 4.80878L9.49989 6.00001C9.49561 5.92548 9.24345 5.88713 9.5 7C9.49345 8.11289 8.59763 9 7.5 9C6.81406 9 6.20237 8.68594 5.86902 8.13098L4.39893 9.60107ZM14.8394 6.88398C13.5936 5.25338 11.6622 3 7.5 3C6.59763 3 5.75655 3.20237 5.00001 3.55837L6.50001 5C6.40237 5 5.50655 5.88713 5.5 7C5.50655 7.24345 5.57452 7.46548 5.68988 7.68988L7.584 9.584C8.75655 9.42548 9.49345 8.49345 9.5 7.41594L13.8839 12.8394C14.4934 12.1129 14.8394 11.2434 14.8394 10.5C14.8394 9.99629 13.3101 8.11604 14.884 8.05837C15.0387 7.85624 15.0387 7.14378 14.884 6.94165L14.8394 6.88398Z" fill="currentColor"></path></svg>;

// --- Type Definitions ---
type Question = { answer: string[]; options: string[]; question: string; explanation: string; question_number: string; };
type Topic = { questions: Question[]; case_study?: string; topic_name?: string; };
type SimulationData = { fileName: string; topics: Record<string, Topic>; };
type SupabaseFile = { 'ai-parsed-data': { result: { topics: Record<string, Topic>; }; }; filename: string; };
type StructuredItem = { type: 'question'; content: Question; parent?: { topic?: string; case_study?: string } };

// --- Helper function ---

/*

const getAllQuestions = (topics: Record<string, Topic>): Question[] => {
  if (!topics) return [];
  let questions: Question[] = [];
  Object.values(topics).forEach((topic: Topic) => {
    if (topic.questions && Array.isArray(topic.questions)) {
      questions.push(...topic.questions);
    }
  });
  return questions.map((q, index) => ({ ...q, question_number: (index + 1).toString() }));
};

*/

// --- Styled Components (Full Definitions) ---
const PageContainer = styled.div` display: flex; flex-direction: column; gap: 16px; `;
const HeaderContainer = styled.div` display: flex; flex-direction: column; gap: 16px; `;
// const HeaderTopRow = styled.div` display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; `;
const FileName = styled.h2` color: #2c2c54; font-weight: bold; font-size: 22px; `;
// const HeaderActions = styled.div` display: flex; align-items: center; gap: 12px; `;
//const SearchInput = styled.div` display: flex; align-items: center; background-color: white; border: 1px solid #E0E0E0; border-radius: 12px; padding: 0 12px; width: 250px; input { border: none; outline: none; padding: 12px 8px; font-size: 14px; flex-grow: 1; } `;
// const GoToButton = styled.button` background: none; border: 1px solid #E0E0E0; padding: 8px 12px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: bold; `;
// const DownloadButton = styled.button` background-color: #673AB7; color: white; border: none; border-radius: 12px; padding: 10px 16px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; `;
// const GoToFieldContainer = styled.div<{ $show: boolean; }>` max-height: ${({ $show }) => $show ? '60px' : '0'}; display: flex; justify-content: center; align-items: center; gap: 8px; padding: ${({ $show }) => $show ? '8px 0' : '0'}; overflow: hidden; transition: all 0.3s ease-in-out; opacity: ${({ $show }) => $show ? '1' : '0'}; `;
const ContentContainer = styled.div` background-color: white; border-radius: 12px; border: 1px solid #E0E0E0; `;
// const TopicHeader = styled.div` display: flex; align-items: center; gap: 16px; padding: 24px; border-bottom: 1px solid #f0f0f0; font-size: 18px; font-weight: bold; color: #424242;`;
const CaseStudyContainer = styled.div` background-color: rgba(239, 234, 254, 0.4); border-bottom: 1px solid rgba(103, 58, 183, 0.2); padding: 26px; `;
const QuestionCardContainer = styled.div` padding: 26px; `;
const QuestionHeader = styled.div` display: flex; align-items: flex-start; gap: 18px; margin-bottom: 24px; `;
const QuestionNumber = styled.div` background-color: rgba(103, 58, 183, 0.12); color: #673AB7; font-weight: bold; font-size: 16px; padding: 12px; border-radius: 10px; `;
// const QuestionText = styled.div` font-size: 17px; font-weight: 500; line-height: 1.34; flex: 1; img { max-width: 100%; border-radius: 8px; margin-top: 10px; } `;
const Label = styled.p` color: #BDBDBD; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; `;
const OptionsList = styled.div` display: flex; flex-direction: column; gap: 6px; padding-left: 76px; @media(max-width: 600px) { padding-left: 0; } `;
const OptionItem = styled.div<{ $isCorrect: boolean; }>` border: 1.1px solid ${({ $isCorrect }) => $isCorrect ? '#2E7D32' : '#E0E0E0'}; background-color: ${({ $isCorrect }) => $isCorrect ? '#E8F5E9' : 'transparent'}; border-radius: 8px; padding: 11px 14px; font-size: 15px; line-height: 1.35; img { max-width: 100%; border-radius: 8px; margin-top: 10px; } `;
const ActionButtons = styled.div` display: flex; justify-content: flex-end; gap: 8px; margin-top: 26px; `;
const PrimaryButton = styled.button` border: none; background-color: #673AB7; color: white; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 500; `;
const ExplanationSection = styled.div` padding-top: 16px; margin-top: 16px; border-top: 1.1px solid #E0E0E0; img { max-width: 100%; border-radius: 8px; margin-top: 10px; } `;
const PaginationContainer = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background-color: white; border: 1px solid #E0E0E0; border-radius: 12px; `;
const PageButton = styled.button` background: none; border: 1px solid #E0E0E0; color: #333; padding: 8px 16px; border-radius: 8px; cursor: pointer; &:disabled { cursor: not-allowed; opacity: 0.5; } `;
const LoadingContainer = styled.div` display: flex; justify-content: center; align-items: center; height: 300px; font-size: 18px; color: #757575;`;

// --- The Main Page Component ---
const SimulationPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [structuredItems, setStructuredItems] = useState<StructuredItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
 // const [showGoTo, setShowGoTo] = useState(false);

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
        let qNum = 1;
        Object.values(topics).forEach((topic: Topic) => {
          (topic.questions || []).forEach((q: Question) => {
            newStructuredItems.push({
              type: 'question',
              content: { ...q, question_number: q.question_number || (qNum++).toString() },
              parent: { topic: topic.topic_name, case_study: topic.case_study }
            });
          });
        });
        setStructuredItems(newStructuredItems);
      }
      setLoading(false);
    }
    getSimulationData();
  }, [fileId]);

  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex]);
  
  const handleNext = () => setCurrentIndex(prev => Math.min(prev + 1, structuredItems.length - 1));
  const handlePrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  const currentItem = structuredItems[currentIndex];

  if (isLoading) return <LoadingContainer>Loading Simulation...</LoadingContainer>;
  if (!currentItem) return <LoadingContainer>Could not load questions for this file.</LoadingContainer>;

   return (
      <PageContainer>
        <HeaderContainer>
          <FileName>{simulationData?.fileName}</FileName>
        </HeaderContainer>
  
        <ContentContainer>
          {/* 2. Using the HtmlRenderer for the Case Study */}
          {currentItem.parent?.case_study && 
            <CaseStudyContainer>
              <HtmlRenderer htmlString={currentItem.parent.case_study} />
            </CaseStudyContainer>
          }
          
          <QuestionCardContainer>
            <QuestionHeader>
              <QuestionNumber>Q: {currentItem.content.question_number}</QuestionNumber>
              {/* 3. Using the HtmlRenderer for the Question Text */}
              <HtmlRenderer htmlString={currentItem.content.question} />
            </QuestionHeader>
            <Label>Options</Label>
            <OptionsList>
              {currentItem.content.options.map((opt: string, index: number) => {
                const optionLetter = String.fromCharCode(65 + index);
                const isCorrect = showAnswer && currentItem.content.answer.includes(optionLetter);
                return (
                  <OptionItem key={index} $isCorrect={isCorrect}>
                    <b>{optionLetter}. </b> 
                    {/* 4. Using the HtmlRenderer for each Option */}
<HtmlRenderer htmlString={opt.replace(/^[A-Z][.)]\s*/, '')} />
                  </OptionItem>
                );
              })}
            </OptionsList>
            <ActionButtons>
              <PrimaryButton onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </PrimaryButton>
            </ActionButtons>
            {showAnswer && (
              <ExplanationSection>
                <Label>Explanation</Label>
                {/* 5. Using the HtmlRenderer for the Explanation */}
                <HtmlRenderer htmlString={currentItem.content.explanation} />
              </ExplanationSection>
            )}
          </QuestionCardContainer>
        </ContentContainer>
        
        <PaginationContainer>
          <span>Question {currentItem.content.question_number} of {structuredItems.length}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <PageButton onClick={handlePrev} disabled={currentIndex === 0}>Back</PageButton>
            <PageButton onClick={handleNext} disabled={currentIndex === structuredItems.length - 1}>Next</PageButton>
          </div>
        </PaginationContainer>
      </PageContainer>
    );
  };
  
  export default SimulationPage;