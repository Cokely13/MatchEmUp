
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStates, deleteState } from '../store/allStatesStore';
import { fetchShows, deleteShow } from '../store/allShowsStore';
import { fetchActors, deleteActor } from '../store/allActorsStore';
import { fetchArtists, deleteArtist } from '../store/allArtistsStore';
import { fetchQuarterbacks, deleteQuarterback } from '../store/allQuarterbacksStore';
import { fetchFranchises, deleteFranchise } from '../store/allFranchisesStore';
import {fetchCities, deleteCity} from '../store/allCitiesStore'
import {updateSingleCity} from '../store/singleCityStore'


function Edit() {
  const dispatch = useDispatch();
  const allStates = useSelector((state) => state.allStates);
  const allShows = useSelector((state) => state.allShows);
  const allFranchises = useSelector((state) => state.allFranchises);
  const allActors = useSelector((state) => state.allActors);
  const allArtists = useSelector((state) => state.allArtists);
  const allCities = useSelector((state) => state.allCities);
  const allQuarterbacks = useSelector((state) => state.allQuarterbacks);
  const [category, setCategory] = useState('states');
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchShows());
    dispatch(fetchFranchises());
    dispatch(fetchActors());
    dispatch(fetchArtists());
    dispatch(fetchQuarterbacks());
    dispatch(fetchCities())
  }, [dispatch]);

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      switch (category) {
        case 'states':
          dispatch(deleteState(itemToDelete));
          break;
        case 'shows':
          dispatch(deleteShow(itemToDelete));
          break;
        case 'franchises':
          dispatch(deleteFranchise(itemToDelete));
          break;
        case 'actors':
          dispatch(deleteActor(itemToDelete));
          break;
        case 'artists':
          dispatch(deleteArtist(itemToDelete));
          break;
          case 'cities':
          dispatch(deleteCity(itemToDelete));
          break;
        case 'quarterbacks':
          dispatch(deleteQuarterback(itemToDelete));
          break;
        default:
          break;
      }
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  const renderList = (items, type) => (
    items && items.length > 0 ? (
      items.map((item) => (
        <div key={item.id} className="item">
          <span className="item-name">{item.name}</span>
          {itemToDelete === item.id ? (
            <span style={{ marginLeft: '10px' }} className="confirm-delete">
              Are you sure?{' '}
              <button className="btn-confirm" onClick={confirmDelete}>Yes</button>
              <button className="btn-cancel" onClick={cancelDelete}>No</button>
            </span>
          ) : (
            <button className="btn-delete" onClick={() => handleDeleteClick(item.id)}>Delete</button>
          )}
        </div>
      ))
    ) : (
      <div>No {type} available</div>
    )
  );

  return (
    <div className="edit-container">
      <h2>Edit Items</h2>
      <div className="dropdown">
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="states">States</option>
          <option value="shows">Shows</option>
          <option value="franchises">Franchises</option>
          <option value="actors">Actors</option>
          <option value="artists">Artists</option>
          <option value="quarterbacks">Quarterbacks</option>
          <option value="cities">Cities</option>
        </select>
      </div>
      <div className="items-list">
        {category === 'states' && renderList(allStates, 'states')}
        {category === 'shows' && renderList(allShows, 'shows')}
        {category === 'franchises' && renderList(allFranchises, 'franchises')}
        {category === 'actors' && renderList(allActors, 'actors')}
        {category === 'artists' && renderList(allArtists, 'artists')}
        {category === 'quarterbacks' && renderList(allQuarterbacks, 'quarterbacks')}
        {category === 'cities' && renderList(allCities, 'cities')}
      </div>
    </div>
  );
  }

  export default Edit;
