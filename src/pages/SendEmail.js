import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import templateEmail, {
  templatedBody,
  templatedSubject,
} from '../gmail/templating';

import firebase from '../firebase/firebase';
import { isCompositeComponent } from 'react-dom/test-utils';

function SendEmail({ auth, selected }) {
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: '',
    attachments: [{ filename: '', file: '' }],
  });
  const [show, setShow] = useState(false);

  const [templates, setTemplates] = useState([]);


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
      // const message =
      //   'Content-Type: multipart/mixed; boundary="boundary"\r\n' +
      //   'Content-Type: multipart/alternative; boundary="alt_boundary"\r\n' +
      //   'MIME-Version: 1.0\r\n' +
      //   `From: ${auth.auth.email}.\r\n` +
      //   `To: ${s.email}\r\n` +
      //   `--boundary\r\n` +
      //   `Content-Type: text/html\r\n` +
      //   `Subject: ${templatedSubject}\r\n\r\n` +
      //   // 'MIME-Version: 1.0\r\n' +
      //   `${templatedBody}\r\n\r\n` +
      //   '--boundary--\r\n' +
      //   `--alt_boundary\r\n` +
      //   `Content-Type: image/jpeg; name="${emailContent.attachments[1].filename}"\r\n` +
      //   // 'MIME-Version: 1.0\r\n' +
      //   'Content-Transfer-Encoding: base64\r\n' +
      //   `Content-Disposition: attachment; filename="${emailContent.attachments[1].filename}"\r\n\r\n` +
      //   `--alt_boundary--\r\n`;
// const newImage = btoa(emailContent.attachments[1].filename);
      const message =
      'Content-Type: multipart/related; boundary="your_boundary"\r\n' +
      `From: ${auth.auth.email}.\r\n` +
      `To: ${s.email}\r\n` +
      `Subject: ${templatedSubject}\r\n\r\n` +
      '--your_boundary\r\n' + 
      'Content-Type: text/plain\r\n' +
      `${templatedBody}\r\n` +
      '--your_boundary\r\n' + 
      `Content-Type: image/jpeg\r\n` +
      'Content-Transfer-Encoding: base64\r\n' +
      `Content-Disposition: attachment; filename="${emailContent.attachments[1].filename}"\r\n\r\n` +
      `${emailContent.attachments[1].file}\r\n` + 
      '--your_boundary--\r\n';


  

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
  // let templates = [];

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

      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots

          setTemplates((templates) => [
            ...templates,
            { id: doc.id, subject: doc.data().subject, body: doc.data().body },
          ]);
          console.log(doc.id, ' => ', doc.data());
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }, []);
  console.log(emailContent.attachments[1]);

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
        <input
          type="file"
          name="attachment"
          onChange={(e) => {
            let newAttach = emailContent.attachments.push({
              filename: e.target.files[0].name,
              file: e.target.value,
            });
            setEmailContent(emailContent, { attachments: newAttach });
          }}
        />
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

        <div style={{ border: '1px solid blue' }}>
          Templates
          <br />
          {templates.map((t, i) => (
            <>
              <button
                style={{ color: 'blue' }}
                onClick={() => {
                  setEmailContent({ subject: t.subject, body: t.body });
                }}
              >
                {t.id}
              </button>
              <br />
            </>
          ))}
        </div>


      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  selected: state.contacts.selectedContacts,
});

export default connect(mapStateToProps)(SendEmail);
