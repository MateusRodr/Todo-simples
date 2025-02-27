import React, { useState } from 'react';
import styles from '../estilizacao/input.module.css'; // Ensure this path is correct or update it to the correct path
import { Eye, EyeOff } from 'lucide-react';

function InputPassword({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [isShow, setShow] = useState(false);

  return (
    <div className={styles.area}>
      <input
        type={isShow ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder="Digite sua senha"
        className="form-control"
        required
      />

      <button type="button" onClick={() => setShow(!isShow)} className={styles.toggleButton}>
        {isShow ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
}

export default InputPassword;
