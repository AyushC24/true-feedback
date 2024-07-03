import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  interface VerificationEmailProps {
    username: string;
    otp: string;
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          {/* Add custom styles for the email */}
          <style type="text/css">
            {`
              body {
                font-family: 'Roboto', Verdana, sans-serif;
                background-color: #f4f4f4;
                padding: 0;
                margin: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                color: #333333;
              }
              .content {
                padding: 20px;
                border-top: 2px solid #eeeeee;
                border-bottom: 2px solid #eeeeee;
                margin-bottom: 20px;
              }
              .content p {
                margin: 10px 0;
                color: #666666;
              }
              .footer {
                text-align: center;
                color: #999999;
              }
            `}
          </style>
        </Head>
        <body>
          <div className="container">
            <div className="header">
              <h1>Welcome to Feedonymous</h1>
            </div>
            <Preview>Here is your verification code: {otp}</Preview>
            <Section className="content">
              <Row>
                <Heading as="h2">Hello {username},</Heading>
              </Row>
              <Row>
                <Text>
                  Thank you for registering. Please use the following verification
                  code to complete your registration:
                </Text>
              </Row>
              <Row>
                <Text className='text-4xl'>{otp}</Text> 
              </Row>
              <Row>
                <Text>
                  If you did not request this code, please ignore this email.
                </Text>
              </Row>
            </Section>
            <div className="footer">
              <p>This email was sent by Feedonymous.</p>
            </div>
          </div>
        </body>
      </Html>
    );
  }
  