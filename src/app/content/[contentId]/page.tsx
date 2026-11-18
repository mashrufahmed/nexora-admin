import ContentEditorClient from './content-editor-client';
import { Suspense } from 'react';

async function ContentEditorRoute({ params }: { params: Promise<{ contentId: string }> }) {
  const { contentId } = await params;
  return <ContentEditorClient contentId={contentId} />;
}

export default function ContentPage({ params }: { params: Promise<{ contentId: string }> }) {
  return <Suspense fallback={null}><ContentEditorRoute params={params} /></Suspense>;
}
