import { InputTypes } from "@/constants/enums";
import { IFormField } from "@/types/app";
import { ValidationErrors } from "@/validations/auth";
import PasswordField from "./password-field";
import TextField from "./text-field";
import Checkbox from "./checkbox";

interface Props extends IFormField {
  error: ValidationErrors;
}

const FormFields = (props: Props) => {
  const { type } = props;
  const renderField = (): React.ReactNode => {
    if (type === InputTypes.EMAIL || type === InputTypes.TEXT) {
      return <TextField {...props} />;
    }

    if (type === InputTypes.PASSWORD) {
      return <PasswordField {...props} />;
    }

    if (type === InputTypes.CHECKBOX) {
      return <Checkbox {...props} />;
    }

    return <TextField {...props} />;
  };

  return <>{renderField()}</>;
};

export default FormFields;