import { useEffect, useState } from "react";
import { schemaUser } from "../../schemas/formSchema";
import styles from "./Form.module.css";
import { ValidationError } from "yup";
import { Button } from "../Button/Button";
import Swal from 'sweetalert2';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };

    setFormData(newData);

    try {
      await schemaUser.validateAt(name, newData);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await schemaUser.validate(formData, { abortEarly: false });
      
      // SweetAlert2 - Éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'El formulario fue enviado correctamente',
        confirmButtonText: 'Aceptar',
        background: '#1a1a1a',
        confirmButtonColor: '#007acc',
      });

      // Reset del formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});

    } catch (error) {
      if (error instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) newErrors[err.path] = err.message;
        });
        setErrors(newErrors);

        // SweetAlert2 - Error
        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: 'Por favor corrige los errores en el formulario',
          background: '#1a1a1a',
          confirmButtonColor: '#007acc',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkValidity = async () => {
      try {
        await schemaUser.validate(formData, { abortEarly: false });
        setFormIsValid(true);
      } catch {
        setFormIsValid(false);
      }
    };
    
    checkValidity();
  }, [formData]);

  return (
    <div className={styles.containerPrincipal}>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <h1>Simple Form</h1>
        <div>
         <div  className={styles.containerinput}>
         <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter your name..."
            onChange={handleChange}
          />
         </div>
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>

        <div>
         <div className={styles.containerinput}>
         <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email..."
            onChange={handleChange}
          />
         </div>
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>

        <div>
          <div className={styles.containerinput}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter your password..."
            onChange={handleChange}
          />
          </div>
          {errors.password && <div className={styles.error}>{errors.password}</div>}
        </div>

        <div>
          <div className={styles.containerinput}>
          <label>Confirm password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm your password..."
            onChange={handleChange}
          />
          </div>
          {errors.confirmPassword && (
            <div className={styles.error}>{errors.confirmPassword}</div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!formIsValid || isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles.spinner}></span>
          ) : 'Enviar'}
        </Button>
      </form>
    </div>
  );
};
