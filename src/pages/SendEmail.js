import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import templateEmail, {
  templatedBody,
  templatedSubject,
} from '../gmail/templating';

import firebase from '../firebase/firebase';
import { isCompositeComponent } from 'react-dom/test-utils';


function SendEmail({ auth, selected }) {
  const [emailContent, setEmailContent] = useState({ subject: '', body: '' });
  const [show, setShow] = useState(false);
  const onChange = (e) => {
    e.preventDefault();
    setEmailContent({ ...emailContent, [e.target.name]: e.target.value });
  };
  function sendEmail() {
    selected.map((s) => {
      // this templated email returns the body with variables replaced. the result is import as 'result'
      templateEmail(s, emailContent.body);
      templateEmail(s, '!Subject! ' + emailContent.subject);
      console.log(templatedSubject, templatedBody);
      const message =
        `From: ${auth.auth.email}.\r\n` +
        `To: ${s.email}\r\n` +
        'Content-Type: text/html\r\n' +
        `Subject: ${templatedSubject}\r\n\r\n` +
        `${templatedBody}`;
      const encodedMessage = btoa(message);
      const reallyEncodedMessage = encodedMessage
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      console.log('message', message);

      window.gapi.client.gmail.users.messages
        .send({
          userId: 'me',
          resource: {
            raw: reallyEncodedMessage,
          },
        })
        .then(() => {
          console.log('email sent');
        });
    });
  }

  const subjectButtons = [];
  const bodyButtons = [];
  if (selected[0]) {
    Object.keys(selected[0]).map((key, i) => {
      if (typeof selected[0][key] == 'object') {
        for (const [nestedKey, ii] of Object.entries(selected[0][key])) {
          subjectButtons.push(
            <button
              onClick={() => {
                const newKey = `%${key}.${nestedKey}%`;
                setEmailContent({
                  ...emailContent,
                  subject: emailContent.subject + ' ' + newKey,
                });
              }}
            >
              {nestedKey}
            </button>
          );
          bodyButtons.push(
            <button
              onClick={() => {
                const newKey = `%${key}.${nestedKey}%`;
                setEmailContent({
                  ...emailContent,
                  body: emailContent.body + ' ' + newKey,
                });
              }}
            >
              {nestedKey}
            </button>
          );
        }
      } else {
        subjectButtons.push(
          <button
            onClick={() => {
              const newKey = `%${key}%`;
              setEmailContent({
                ...emailContent,
                subject: emailContent.subject + ' ' + newKey,
              });
            }}
          >
            {key}
          </button>
        );
        bodyButtons.push(
          <button
            onClick={() => {
              const newKey = `%${key}%`;
              setEmailContent({
                ...emailContent,
                body: emailContent.body + ' ' + newKey,
              });
            }}
          >
            {key}
          </button>
        );
      }
    });
  }

  let tempName;
  let templates = [];

  function saveTemplate() {
    if (tempName) {
      firebase
        .firestore()
        .collection(`users/${auth.auth.uid}/templates/`)
        .doc(tempName)
        .set(emailContent);
    } else {
      console.log('template needs a name!');
    }
  }

  useEffect(() => {
    firebase
      .firestore()
      .collection(`users/${auth.auth.uid}/templates/`)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((d) => {
          d.data();
          templates.push(
            d.data()
            // <button
            //   onClick={() =>
            //     setEmailContent({
            //       ...emailContent,
            //       subject: d.data().subject,
            //       body: d.data().body,
            //     })
            //   }
            // >
            //   balls
            // </button>
          );
          console.log(templates);
        });
      });
  }, []);




  return (
    <div className="text-center">
      {selected.map((s, i) => (
        <p key={i}>{s.firstName}</p>
      ))}
      <div>
        <label>Subject</label>
        <input
          name="subject"
          onChange={onChange}
          value={emailContent.subject}
        />
        <br />
        {selected[0] ? <div>{subjectButtons}</div> : <div></div>}
        <br />
        <label>Body</label>
        <textarea
          className="email-body"
          name="body"
          id="body"
          onChange={onChange}
          value={emailContent.body}
        />

        {selected[0] ? <div>{bodyButtons}</div> : <div></div>}

        <br />
        <br />

        <button onClick={sendEmail}>Send Email</button>
        <br />

        {show ? (
          <div>
            <label>Template Name</label>
            <input
              type="text"
              name="templateName"
              onChange={(e) => {
                tempName = e.target.value;
              }}
            ></input>
            <button onClick={saveTemplate}>Save Template</button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setShow(true);
              }}
            >
              Save Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  selected: state.contacts.selectedContacts,
});

export default connect(mapStateToProps)(SendEmail);
