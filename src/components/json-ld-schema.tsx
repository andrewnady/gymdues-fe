/**
 * Renders JSON-LD script tag(s) for Schema.org structured data.
 * Pass one or more schema objects; each is output as a separate script.
 */

interface JsonLdSchemaProps {
  /** One or more schema objects (e.g. from schema-builder). */
  data: object | object[]
}

export function JsonLdSchema({ data }: JsonLdSchemaProps) {
  const schemas = Array.isArray(data) ? data : [data]
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
