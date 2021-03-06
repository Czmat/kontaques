import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import templateEmail, {
  templatedBody,
  templatedSubject,
} from '../../gmail/templating';
import styles from './SendEmail.module.css';

import firebase from '../../firebase/firebase';
import { isCompositeComponent } from 'react-dom/test-utils';

function SendEmail({ auth, selectedContacts }) {
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: '',
    attachments: [],
  });
  const [show, setShow] = useState(false);

  const [templates, setTemplates] = useState([]);
  const onChange = (e) => {
    e.preventDefault();
    setEmailContent({ ...emailContent, [e.target.name]: e.target.value });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('reader.result', reader.result);
        return resolve(reader.result.replace(/^.*;base64,/, ''));
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  async function sendEmail() {
    const encodedAttachments = await Promise.all(
      emailContent.attachments.map(async (a) => {
        let attachment = await toBase64(a);
        const type = a.type || 'application/octet-stream';
        return (
          `--your_boundary\r\n` +
          `Content-Type: ${type}; name="${a.name}"\r\n` +
          `Content-Transfer-Encoding: base64\r\n` +
          `Content-Disposition: attachment; filename="${a.name}"\r\n\r\n` +
          `${attachment}\r\n\r\n`
        );
      })
    );
    let attachments = encodedAttachments.join('');

    selectedContacts.forEach((s) => {
      // this templated email returns the body with variables replaced. the result is import as 'result'
      templateEmail(s, emailContent.body);
      templateEmail(s, '!Subject! ' + emailContent.subject);

      const message =
        'Content-Type: multipart/mixed; boundary="your_boundary"\r\n' +
        `From: ${auth.auth.email}\r\n` +
        `To: ${s.email}\r\n` +
        `Subject: ${templatedSubject}\r\n\r\n` +
        `--your_boundary\r\n` +
        'Content-Type: text/html\r\n\r\n' +
        `${templatedBody}\r\n` +
        `${attachments}` +
        '--your_boundary--\r\n';

      const encodedMessage = btoa(message);
      const reallyEncodedMessage = encodedMessage
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

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
  const [contact1] = selectedContacts;
  if (contact1) {
    Object.keys(contact1).map((key, i) => {
      if (typeof contact1[key] == 'object') {
        for (const [nestedKey, ii] of Object.entries(contact1[key])) {
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

  function removeAttachments(a) {
    const index = emailContent.attachments.indexOf(a);
    const newArray = emailContent.attachments.slice(index - 1, index);
    setEmailContent({ ...emailContent, attachments: newArray });
  }
  const uploadedAttachments = emailContent.attachments.map((a) => (
    <div>
      <p>{a.name}</p>
      <button onClick={(a) => removeAttachments(a)}>X</button>
    </div>
  ));

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
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }, []);

  return (
    <div className={styles.sendEmail}>
      {selectedContacts.length > 0 ? (
        <div className='text-center'>
          <ul>
            {selectedContacts.map((s, i) => (
              <li key={i}>
                <h3>{s.firstName}</h3>
              </li>
            ))}
          </ul>
          <div className={styles.emailForm}>
            <label>Subject</label>
            {contact1 ? (
              <div className={styles.emailKeys}>{subjectButtons}</div>
            ) : (
              <div></div>
            )}
            <input
              name='subject'
              onChange={onChange}
              value={emailContent.subject}
            />
            {/* <br />

            <br /> */}
            <label className={styles.emailBodyLabel}>Body</label>
            {contact1 ? (
              <div className={styles.emailKeys}>{bodyButtons}</div>
            ) : (
              <div></div>
            )}
            <textarea
              // className='email-body'
              name='body'
              id='body'
              onChange={onChange}
              value={emailContent.body}
            />

            <br />
            <div>
              <input
                type='file'
                name='attachment'
                onChange={(e) => {
                  const [file] = e.target.files;

                  setEmailContent({
                    ...emailContent,
                    attachments: [...emailContent.attachments, file],
                  });
                  e.target.value = '';
                }}
              />
            </div>
            {uploadedAttachments}
            <br />

            <button className={styles.submitButton} onClick={sendEmail}>
              Send Email
            </button>
            <br />
            {show ? (
              <div className={styles.saveTemplate}>
                <label>Template Name</label>
                <input
                  type='text'
                  name='templateName'
                  onChange={(e) => {
                    tempName = e.target.value;
                  }}
                ></input>
                <button
                  className={styles.submitButton}
                  onClick={() => {
                    saveTemplate();
                    setShow(false);
                  }}
                >
                  Save Template
                </button>
              </div>
            ) : (
              <div>
                <button
                  className={styles.submitButton}
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  Add Template
                </button>
              </div>
            )}
            <div
              className={styles.templateDisplay}
              style={{ border: '1px solid blue' }}
            >
              {templates.map((t, i) => (
                <div className={styles.templates}>
                  <button
                    style={{ color: 'blue' }}
                    onClick={() => {
                      setEmailContent({ subject: t.subject, body: t.body });
                    }}
                  >
                    {t.id}
                  </button>
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h2>Please select contacts</h2>
      )}
    </div>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  selectedContacts: state.contacts.selectedContacts,
});

export default connect(mapStateToProps)(SendEmail);
