let result;
let trim = '';

export default function templateEmail(contact, body) {
  var splitString = body.split(' ');

  (function () {
    splitString.forEach((s) => {
      if (s[0] == '%') {
        const index = splitString.indexOf(s);
        if (
          s[s.length - 1] == ',' ||
          s[s.length - 1] == '!' ||
          s[s.length - 1] == '?' ||
          s[s.length - 1] == '"'
        ) {
          trim = s[s.length - 1];
          s = s.replace(/[!?,"]/g, '');
        }
        if (s[s.length - 1] == '%') {
          let attribute = s.replace(/%/g, '');

          if (index > -1) {
            if (contact[attribute]) {
              let newWord = contact[attribute].concat(trim);
              splitString.splice(index, 1, newWord);
            } else {
              splitString.splice(index, 1, '!ERR: Missing ' + attribute + '!');
            }
          }
        }
      }
    });
  })();

  result = splitString.join(' ');
}
export { result };
