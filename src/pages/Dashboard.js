import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Dashboard({ auth }) {
  let history = useHistory();
  console.log(auth);

  if (auth.auth != true) {
    setTimeout(() => {
      history.push('/login');
    }, 3000);
  }

  return (
    <div>
      {auth.auth ? (
        <div>Congratulations. This is the Dashboard. This is protected.</div>
      ) : (
        <div>Sorry dude. Redirecting you now</div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Dashboard);
