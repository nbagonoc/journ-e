const moment = require("moment");

module.exports = {
  // truncates the body text of journals from N to 150 at the display all public journals
  truncate: (str, len) => {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  // strips the HMTL tags that is used in the display all public journal
  stripper: input => {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  // beautify the date format thanks to moment
  formatDate: (date, format) => {
    return moment(date).format(format);
  },
  // selects the default/current selected option when using forms
  select: (selected, options) => {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
  //
  editableIfUser: (journalUser, loggedUser, journalId) => {
    if (journalUser == loggedUser) {
      return `<a href="/journals/edit/${journalId}"
      class="btn btn-info btn-sm"><i class="fas fa-pencil-alt mr-1"></i>Edit</a>`;
    } else {
    }
  }
};
