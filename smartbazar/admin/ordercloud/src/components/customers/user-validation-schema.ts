import * as yup from "yup";
export const customerValidationSchema = yup.object().shape({
  name: yup.string().required("form:error-name-required"),
});