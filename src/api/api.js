import axios from "axios";

const BASE_URL = "https://kbybdtacoqvgcijrkzkv.supabase.co/rest/v1";

const HEADERS = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieWJkdGFjb3F2Z2NpanJremt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzUwNjAsImV4cCI6MjA3MTYxMTA2MH0.SAF_9jupuaVLHq0l7Zbew7t6avUdg_UkdVGqLZmHTQE",
  apikey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieWJkdGFjb3F2Z2NpanJremt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzUwNjAsImV4cCI6MjA3MTYxMTA2MH0.SAF_9jupuaVLHq0l7Zbew7t6avUdg_UkdVGqLZmHTQE",
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// To get all Tasks :-
export const getTasks = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/tasks`, { headers: HEADERS });
    return res.data;
  } catch (err) {
    console.error("Error fetching tasks:", err.response?.data || err.message);
    return [];
  }
};

// To create a new task :-
export const createTask = async (task) => {
  try {
    const res = await axios.post(`${BASE_URL}/tasks`, task, {
      headers: HEADERS,
    });
    return res.data;
  } catch (err) {
    console.error("Error creating task:", err.response?.data || err.message);
    return null;
  }
};

// To get all Categories :-
export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      headers: HEADERS,
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};
