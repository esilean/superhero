import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {}

export const TimeInput: React.FC<IProps> = (
  { input, width, placeholder, meta: { touched, error } },
  ...rest
) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DatePicker
        placeholderText={placeholder}
        selected={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={(e) => e.preventDefault()}
        showTimeSelect
        showTimeSelectOnly
        timeCaption="Time"
        timeFormat="h:mm a"
        timeIntervals={15}
        dateFormat="h:mm a"
        {...rest}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
