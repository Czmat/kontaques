import React, { useState } from 'react';
import { connect } from 'react-redux';
import templateEmail, { result } from '../gmail/templating';
function SendEmail({ auth, selected }) {
  const [emailContent, setEmailContent] = useState({ subject: '', body: '' });
  const onChange = (e) => {
    e.preventDefault();
    setEmailContent({ ...emailContent, [e.target.name]: e.target.value });
  };
  function sendEmail() {
    selected.map((s) => {
      // this templated email returns the body with variables replaced. the result is import as 'result'
      templateEmail(s, emailContent.body);

      const message =
        `From: ${auth.auth.email}.\r\n` +
        `To: ${s.email}\r\n` +
        'Content-Type: text/html\r\n' +
        `Subject: ${emailContent.subject}\r\n\r\n` +
        `${result}`;
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

  return (
    <div className="text-center">
      {selected.map((s, i) => (
        <p key={i}>{s.firstName}</p>
      ))}
      <div>
        <label>Subject</label>
        <input name="subject" onChange={onChange} />
        <br />
        <div>
          {selected[0] ? (
            Object.keys(selected[0]).map((key, i) => (
              <button
                key={i}
                onClick={() => {
                  const newKey = `%${key}%`;
                  setEmailContent({
                    ...emailContent,
                    body: emailContent.body + newKey,
                  });
                }}
              >
                {key}
              </button>
            ))
          ) : (
            <div></div>
          )}
        </div>
        <br />
        <label>Body</label>
        <textarea
          className="email-body"
          name="body"
          id="body"
          onChange={onChange}
          value={emailContent.body}
        />
        <br />

        <button onClick={sendEmail}>Send Email</button>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  selected: state.contacts.selectedContacts,
});

export default connect(mapStateToProps)(SendEmail);
