// Status text is never presented as a published CMS document.
export default function CmsContentStatus({ category, loading, failed, featured = false, onDark = false }: {
  category: string; loading?: boolean; failed?: boolean; featured?: boolean; onDark?: boolean;
}) {
  return (
    <div role="status" style={{ padding: "36px", gridRow: featured ? "span 2" : undefined, color: onDark ? "var(--text-primary-inv)" : "var(--heading)", border: "1px solid var(--border)", borderRadius: 20 }}>
      <p style={{ margin: "0 0 12px", fontWeight: 600 }}>{category}</p>
      <p style={{ margin: 0 }}>
        {loading ? "Nalaganje…" : failed ? "Vsebine trenutno ni mogoče naložiti. Poskusite znova pozneje." : "V tej rubriki še ni objavljenih vsebin."}
      </p>
    </div>
  );
}
