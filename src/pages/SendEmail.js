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
    attachments: [],
  });
  const [show, setShow] = useState(false);

  const [templates, setTemplates] = useState([]);
  console.log('auth', auth.auth.uid);
  const onChange = (e) => {
    e.preventDefault();
    setEmailContent({ ...emailContent, [e.target.name]: e.target.value });
  };
  function sendEmail() {
    let attachments = [];

    emailContent.attachments.forEach(async (a) => {
      // console.log('extension', extension);
      let attachment = await toBase64(a);
      if (a.type) {
        attachments.push(`--your_boundary\r\n
        Content-Type: ${a.type}\r\n 
      Content-Transfer-Encoding: base64\r\n
      Content-Disposition: attachment; filename="${a.name}"\r\n\r\n
      ${attachment}\r\n`);
      } else {
        let extension = a.name.slice(((a.name.lastIndexOf('.') - 1) >>> 0) + 2);
        if ((extension = 'docx')) {
          attachments.push(`--your_boundary\r\n
        Content-Type: application/octet-stream\r\n 
            Content-Transfer-Encoding: base64\r\n
            Content-Disposition: attachment; filename="${a.name}"\r\n\r\n
            ${attachment}\r\n`);
        }
      }
    });
    console.log('before');
    console.log('attachments', attachments);

    let a = attachments.join('');
    console.log('before', a);
    let b = '';
    if (attachments) {
      attachments.forEach((att) => {
        b += att;
      });
    }
    console.log('b', b);

    // emailContent.attachments[0].filename.slice(
    //   ((emailContent.attachments[0].filename.lastIndexOf('.') - 1) >>> 0) + 2
    // );

    // const attachment = await toBase64(emailContent.attachments[0].file);
    // console.log('slice', attachment.slice(attachment.indexOf('base64') + 6));

    // selected.map((s) => {
    //   // this templated email returns the body with variables replaced. the result is import as 'result'
    //   templateEmail(s, emailContent.body);
    //   templateEmail(s, '!Subject! ' + emailContent.subject);
    //   console.log(templatedSubject, templatedBody);

    //   const message =
    //     'Content-Type: multipart/mixed; boundary="your_boundary"\r\n' +
    //     `From: ${auth.auth.email}.\r\n` +
    //     `To: ${s.email}\r\n` +
    //     `Subject: ${templatedSubject}\r\n\r\n` +
    //     '--your_boundary\r\n' +
    //     'Content-Type: text/html\r\n\r\n' +
    //     `${templatedBody}\r\n\r\n` +
    //     '--your_boundary\r\n' +
    //     `${attachments.join()}\r\n` +
    //     '--your_boundary--\r\n';

    //   const encodedMessage = btoa(message);
    //   const reallyEncodedMessage = encodedMessage
    //     .replace(/\+/g, '-')
    //     .replace(/\//g, '_')
    //     .replace(/=+$/, '');
    //   console.log('message', message);

    // window.gapi.client.gmail.users.messages
    //   .send({
    //     userId: 'me',
    //     resource: {
    //       raw: reallyEncodedMessage,
    //     },
    //   })
    //   .then(() => {
    //     console.log('email sent');
    // });
    // });
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
  console.log(emailContent);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.replace(/^.*base64,/, ''));
      reader.onerror = (error) => reject(error);
    });

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
        <div>
          <input
            type="file"
            name="attachment"
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
