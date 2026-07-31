import { supabase } from './supabaseClient';

const TABLE_NAME = 'poppins_user_data';

export const CLOUD_DATASETS = {
  missions: 'missions',
  projects: 'projects',
  tags: 'tags',
  writingTitles: 'writing_titles'
};

export const upsertCloudDataset = async (userId, datasetKey, payload) => {
  if (!supabase || !userId) return null;
  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert({
      user_id: userId,
      dataset_key: datasetKey,
      payload,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,dataset_key' });

  if (error) throw error;
  return true;
};

export const saveCloudBundle = async (userId, bundle) => {
  const entries = [
    [CLOUD_DATASETS.missions, bundle.missions || []],
    [CLOUD_DATASETS.projects, bundle.projects || []],
    [CLOUD_DATASETS.tags, bundle.availableTags || []],
    [CLOUD_DATASETS.writingTitles, bundle.writingTitles || []]
  ];

  for (const [datasetKey, payload] of entries) {
    await upsertCloudDataset(userId, datasetKey, payload);
  }
};

export const loadCloudBundle = async (userId) => {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('dataset_key,payload,updated_at')
    .eq('user_id', userId);

  if (error) throw error;

  const bundle = {
    missions: [],
    projects: [],
    availableTags: [],
    writingTitles: [],
    updatedAt: null
  };

  (data || []).forEach(row => {
    if (row.dataset_key === CLOUD_DATASETS.missions) bundle.missions = Array.isArray(row.payload) ? row.payload : [];
    if (row.dataset_key === CLOUD_DATASETS.projects) bundle.projects = Array.isArray(row.payload) ? row.payload : [];
    if (row.dataset_key === CLOUD_DATASETS.tags) bundle.availableTags = Array.isArray(row.payload) ? row.payload : [];
    if (row.dataset_key === CLOUD_DATASETS.writingTitles) bundle.writingTitles = Array.isArray(row.payload) ? row.payload : [];
    if (row.updated_at && (!bundle.updatedAt || row.updated_at > bundle.updatedAt)) bundle.updatedAt = row.updated_at;
  });

  return bundle;
};
