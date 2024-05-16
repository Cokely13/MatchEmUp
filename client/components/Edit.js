
// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchShows, deleteShow } from '../store/allShowsStore';
// import {fetchStates, deleteState} from '../store/allStatesStore'
// import { updateSingleState} from '../store/singleStateStore'

// function Edit() {
//   const dispatch = useDispatch();
//   const allStates= useSelector((state) => state.allStates);

//   useEffect(() => {
//     dispatch(fetchStates());
//   }, []);

// console.log("all", allStates)

//   return (
//     <div>
//     <div>Edit</div>
//     { allStates ? allStates.map((state) => (
//       <div>{state.name}
//       </div>
//     )) : <div>Nada</div>}
//     </div>
//   )
// }

// export default Edit

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStates, deleteState } from '../store/allStatesStore';

function Edit() {
  const dispatch = useDispatch();
  const allStates = useSelector((state) => state.allStates);
  const [stateToDelete, setStateToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  const handleDeleteClick = (stateId) => {
    setStateToDelete(stateId);
  };

  const confirmDelete = () => {
    if (stateToDelete) {
      dispatch(deleteState(stateToDelete));
      setStateToDelete(null);
    }
  };

  const cancelDelete = () => {
    setStateToDelete(null);
  };

  return (
    <div>
      <div>Edit</div>
      {allStates && allStates.length > 0 ? (
        allStates.map((state) => (
          <div key={state.id} style={{ marginBottom: '10px' }}>
            {state.name}
            {stateToDelete === state.id ? (
              <span>
                {' '}
                Are you sure?{' '}
                <button onClick={confirmDelete}>Yes</button>
                <button onClick={cancelDelete}>No</button>
              </span>
            ) : (
              <button onClick={() => handleDeleteClick(state.id)}>Delete</button>
            )}
          </div>
        ))
      ) : (
        <div>Nada</div>
      )}
    </div>
  );
}

export default Edit;
