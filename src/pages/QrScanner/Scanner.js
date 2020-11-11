import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import vCard from 'vcard-parser';

const Scanner = ({ dispatch, qrContact }) => {
  const [qrData, setQrData] = useState({
    delay: 500,
    result: 'No result',
    facingMode: 'user',
  });

  const handleScan = (data) => {
    let raw;
    if (data !== null) {
      setQrData({
        ...qrData,
        result: data,
      });

      raw = data;
      const card = vCard.parse(raw);
      console.log('raw', card);
      const qrContactToUpdate = {
        address: {
          street_address: card.adr ? card.adr[0].value[2] : '',
          zipCode: card.adr ? card.adr[0].value[5] : '',
          city: card.adr ? card.adr[0].value[3] : '',
          state: card.adr ? card.adr[0].value[4] : '',
        },
        description: card.d ? card.d : '',
        email: card.email ? card.email[0].value : '',
        firstName: card.n ? card.n[0].value[1] : '',
        id: '',
        lastName: card.n[0].value[0],
        occupation: card.title[0].value,
        photoFile: '',
        telephone: card.tel[0].value,
      };
      console.log('qr', qrContactToUpdate);

      // update redux
      updateQrContact(qrContactToUpdate);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  // redirect
  let history = useHistory();

  function goToUpdateContact() {
    history.push(`/contact-data`);
  }

  // add scanned contact to redux
  const updateQrContact = (qrContactToUpdate) => {
    dispatch({ type: 'UPDATE_CONTACT', payload: qrContactToUpdate });
    goToUpdateContact();
  };

  // temp styles for scanner
  const previewStyle = {
    width: '100%',
  };

  const firstDiv = {
    width: '100%',
    maxWidth: '250px',
  };
  console.log('qr data', qrContact);
  return (
    <div style={firstDiv}>
      <select
        onChange={(e) => setQrData({ ...qrData, facingMode: e.target.value })}
      >
        <option value="user">Front Camera</option>
        <option value="environment">Rear Camera</option>
      </select>
      <QrReader
        delay={qrData.delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
        facingMode={qrData.facingMode}
      />
      <p>{qrData.result}</p>

      <h1>My Scanner</h1>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  contacts: state.contacts,
  qrContact: state.contacts.qrContact,
});

export default connect(mapStateToProps)(Scanner);
