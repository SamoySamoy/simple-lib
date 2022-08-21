const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
  {
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
  }
);

// Virtual for author's full name
AuthorSchema
  .virtual('name')
  .get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullname = '';
    if (this.first_name && this.family_name) {
      fullname = `${this.family_name}, ${this.first_name}`;
    }
    if (!this.first_name || !this.family_name) {
      fullname = '';
    }
    return fullname;
  });

// Virtual for author's URL
AuthorSchema
  .virtual('url')
  .get(function () {
    return `/catalog/author/${this._id}`;
  });

//Formatted date of authors  
AuthorSchema
  .virtual('date_formatted')
  .get(function () {
    let date = '';
    if (this.date_of_birth && !this.date_of_death) {
      date += DateTime
        .fromJSDate(this.date_of_birth)
        .toLocaleString(DateTime.DATE_MED);
      return `${date} - now`;
    }
    if (!this.date_of_birth && !this.date_of_death) {
      return 'undefined';
    }
    if (this.date_of_birth && this.date_of_death) {
      date += DateTime
        .fromJSDate(this.date_of_birth)
        .toLocaleString(DateTime.DATE_MED);
      date += ' - '
      date += DateTime
        .fromJSDate(this.date_of_death)
        .toLocaleString(DateTime.DATE_MED);
      return date;
    }
    if (!this.date_of_birth && this.date_of_death) {
      date += DateTime
        .fromJSDate(this.date_of_death)
        .toLocaleString(DateTime.DATE_MED);
      return `undefined - ${date}`;
    }
  });

//Export model
module.exports = mongoose.model('Author', AuthorSchema);