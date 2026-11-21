import { Suspense } from 'react';
import ContentEditorClient from './content-editor-client';

async function ContentEditorRoute({
  params,
}: {
  params: Promise<{ contentId: string }>;
}) {
  const { contentId } = await params;
  return <ContentEditorClient contentId={contentId} />;
}

export default function ContentPage({
  params,
}: {
  params: Promise<{ contentId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <ContentEditorRoute params={params} />
    </Suspense>
  );
}
