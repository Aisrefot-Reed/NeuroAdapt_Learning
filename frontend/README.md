# NeuroAdapt Learning - Frontend

This is the Next.js frontend for the NeuroAdapt Learning platform.

## 🚀 Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔗 Connecting to the Backend

When the frontend and backend are deployed separately, the frontend needs to know the public URL of your backend API.

1.  **Create an Environment File**: Create a file named `.env.local` in the root of the `frontend` directory.
2.  **Add the API URL**: Add the following line to the `.env.local` file, replacing the placeholder with your actual backend URL:

    ```
    NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
    ```

For local development, you would typically use:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🎨 Integrating with v0.dev

v0.dev generates React components with Tailwind CSS, which can be directly integrated into this project.

1.  **Generate Components**: Use the v0.dev platform to visually design and generate your UI components.
2.  **Copy the Code**: v0.dev provides the JSX/TSX code for each component. Use the "Copy Code" feature.
3.  **Create a New File**: In your Next.js project, create a new `.tsx` file inside the `frontend/src/components` directory (e.g., `frontend/src/components/MyNewComponent.tsx`).
4.  **Paste the Code**: Paste the code you copied from v0.dev into this new file.
5.  **Import and Use**: You can now import and use this component in any of your pages (e.g., in `frontend/src/app/page.tsx`).

    ```tsx
    import MyNewComponent from '@/components/MyNewComponent';

    export default function HomePage() {
      return (
        <div>
          <h1>Welcome</h1>
          <MyNewComponent />
        </div>
      );
    }
    ```

## ▲ Deploying on Vercel

Vercel is the recommended platform for deploying Next.js applications.

1.  **Push to Git**: Ensure your entire project, including the `frontend` directory, is pushed to a Git repository (e.g., on GitHub, GitLab, or Bitbucket).
2.  **Import Project on Vercel**: Log in to your Vercel account and click "Add New..." > "Project". Select the Git repository you just pushed.
3.  **Configure Project**:
    *   Vercel will automatically detect that you are deploying a Next.js application.
    *   In the "Configure Project" screen, expand the "Build & Development Settings" section.
    *   Set the **Root Directory** to `frontend`. This tells Vercel to look for the Next.js project inside this subfolder.
    *   Go to the **Environment Variables** section and add `NEXT_PUBLIC_API_URL`. Set its value to the public URL of your deployed backend API.
4.  **Deploy**: Click the "Deploy" button. Vercel will handle the build process and deploy your frontend application.
