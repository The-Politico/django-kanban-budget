import $ from 'jquery';
import SimpleMDE from 'simplemde';


const descriptionMaxlength = $("textarea[name='description']").attr('maxlength');

const descriptionEditor = new SimpleMDE({
  element: $("textarea[name='description']")[0],
  forceSync: true,
  status: false,
  toolbar: [
    'bold',
    'italic',
  ],
});

descriptionEditor.codemirror.on('beforeChange', (instance, change) => {
  if (
    descriptionEditor.value().length >= descriptionMaxlength &&
    change.origin === '+input'
  ) { change.cancel(); }
});
