import { useAuthContext } from '../../contexts/authContext';
import './TaskComponent.css';

export default function TaskComponent() {
  const authContext = useAuthContext();
  return (
    <div className="task-component">
      {authContext.user ? <div>
        <h1>Tasks</h1>
      </div> : <p>Please login to view this resource.</p>}
      
    </div>
  )
}