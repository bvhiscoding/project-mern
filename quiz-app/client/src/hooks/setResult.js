import { useState } from 'react';
import { postServerData } from '../helper/helper';

const useSaveResult = () => {
  const [saveState, setSaveState] = useState({
    isSaving: false,
    saveError: null,
    savedData: null
  });

  const saveResult = async (payload) => {
    setSaveState({
      isSaving: true,
      saveError: null,
      savedData: null
    });

    try {
      const data = await postServerData('/api/result', payload);
      setSaveState({
        isSaving: false,
        saveError: null,
        savedData: data
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;

      setSaveState({
        isSaving: false,
        saveError: message,
        savedData: null
      });

      throw new Error(message);
    }
  };

  return {
    ...saveState,
    saveResult
  };
};

export default useSaveResult;
