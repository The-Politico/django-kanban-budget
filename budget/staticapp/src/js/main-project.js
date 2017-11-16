import $ from 'jquery';
import 'select2';
import SimpleMDE from 'simplemde';
import Pikaday from 'pikaday';


$('.multiselect').select2();

const descriptionMaxlength = $("textarea[name='description']").attr('maxlength');

const descriptionEditor = new SimpleMDE({
  element: $("textarea[name='description']")[0],
  forceSync: true,
  status: false,
  toolbar: [
    'bold',
    'italic',
    'link',
  ],
});

descriptionEditor.codemirror.on('beforeChange', (instance, change) => {
  if (
    descriptionEditor.value().length >= descriptionMaxlength &&
    change.origin === '+input'
  ) { change.cancel(); }
});

const notesEditor = new SimpleMDE({
  element: $("textarea[name='notes']")[0],
  forceSync: true,
  status: false,
  toolbar: [
    'bold',
    'italic',
    'heading',
    'unordered-list',
    'link',
  ],
});

const runDatePicker = new Pikaday({
  field: $("input[name='run_date']")[0],
});
