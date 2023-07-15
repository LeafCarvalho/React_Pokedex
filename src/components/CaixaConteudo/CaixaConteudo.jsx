// CSS
import styles from './CaixaConteudo.module.css';

export const CaixaConteudo = ({children}) => {
  return (
    <div className={styles.container}>
        {children}
    </div>
  )
}