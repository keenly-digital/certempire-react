// src/components/common/Footer.tsx

const Footer = () => null;
export default Footer;

/*

import React from 'react';
import styled from 'styled-components';
import logoWhite from '../../assets/images/logo-white.png';

// The 'margin-top: auto;' line has been removed from here.
const FooterContainer = styled.footer`
  background-color: #2c2c54;
  color: white;
  padding: 50px 32px;
`;

// ... (The rest of the file is the same as before)
const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  p, a {
    color: #dcdcdc;
    text-decoration: none;
    line-height: 1.8;
  }

  a:hover {
    color: white;
  }
`;

const Logo = styled.img`
  width: 180px;
  margin-bottom: 16px;
`;

const LinkList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 8px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <Logo src={logoWhite} alt="Cert Empire" />
          <p>
            CERTEMPIRE is your one-stop shop to access IT Certification Exam Dumps. We have helped thousands of people achieve their dreams of certification.
          </p>
        </FooterColumn>

        <FooterColumn>
          <h4>Helpful Links</h4>
          <LinkList>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Refund Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Login/Register</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </LinkList>
        </FooterColumn>

        <FooterColumn>
          <h4>Top Vendors</h4>
          <LinkList>
            <li><a href="#">Microsoft</a></li>
            <li><a href="#">CompTIA</a></li>
            <li><a href="#">Amazon</a></li>
            <li><a href="#">Salesforce</a></li>
            <li><a href="#">ISC2</a></li>
          </LinkList>
        </FooterColumn>

        <FooterColumn>
          <h4>Contact Us</h4>
          <a href="mailto:sales@certempire.com">sales@certempire.com</a>
        </FooterColumn>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

*/
