# React + Vite API Setup Guide

This project uses React (Vite) on frontend and fetches products from a public API.

## Final API Request Flow

Frontend call:

- Real API: `GET https://dummyjson.com/products`
- If real API fails/unavailable: automatically falls back to local fake products

## Key Files

- `vite.config.js`: Vite dev server proxy config
- `services/apiClient.js`: global Axios client + interceptors
- `services/productApi.js`: product API functions
- `context/ApiContext.jsx`: global API status context
- `hooks/useApi.js`: smart API function (real API first, auto fallback)
- `components/ApiStatusBar.jsx`: global API status bar
- `components/ProductSkeleton.jsx`: loading skeleton card
- `ProductGridSection.jsx`: UI component fetching products

## Current API Behavior

- Always tries the real API first (`https://dummyjson.com/products`)
- Currently targets tech products (laptops and other PC/tech items) and filters out non-tech categories
- If the real API is down or returns a bad response, it automatically uses fake PC products (GPU, CPU, RAM, etc.)
- The UI never crashes because the API function always returns an array of tech-only products

## How to Run

1. Start frontend:

```bash
npm run dev
```

2. Open app and verify product data loads (real API or auto-fallback).

## Troubleshooting

- If products do not load:
  - your network may be blocked from accessing `https://dummyjson.com`
  - the app should still show fake products automatically

## Improvement Notes

- Keep all API calls through `services/*Api.js` files to avoid scattered URLs.
- If more endpoints are added, reuse `axiosInstance` to keep timeout/baseURL consistent.
