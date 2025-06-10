import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';

export interface InputProps extends AntInputProps {}

const InputComponent: React.FC<InputProps> = (props) => {
  return <AntInput {...props} />;
};

// Password field
export interface PasswordProps extends React.ComponentProps<typeof AntInput.Password> {}

export const Password: React.FC<PasswordProps> = (props) => {
  return <AntInput.Password {...props} />;
};

// TextArea field
export interface TextAreaProps extends React.ComponentProps<typeof AntInput.TextArea> {}

export const TextArea: React.FC<TextAreaProps> = (props) => {
  return <AntInput.TextArea {...props} />;
};

// Create a composite component
type InputType = typeof InputComponent & {
  Password: typeof Password;
  TextArea: typeof TextArea;
};

const Input = InputComponent as InputType;
Input.Password = Password;
Input.TextArea = TextArea;

export default Input;
