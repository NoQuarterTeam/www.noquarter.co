import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

export const formatPageProperties = (page: Omit<PageObjectResponse, "cover"> & { cover: string | null }) => {
  // return page properties as a flat object
  const properties = page.properties
  return {
    id: page.id,
    title: properties.Name.type === "title" ? properties.Name.title[0].plain_text : "",
    description: properties.Description.type === "rich_text" ? properties.Description.rich_text : null,
    tags: properties.Tags.type === "multi_select" ? properties.Tags.multi_select.map((tag) => tag.name) : [],
    image: page.cover,
    meta: properties.Meta.type === "rich_text" ? properties.Meta.rich_text[0]?.plain_text : "",
    externalLink: properties["External link"].type === "url" ? properties["External link"].url : null,
    slug:
      properties.Slug.type === "rich_text"
        ? properties.Slug.rich_text.length > 0
          ? properties.Slug.rich_text[0]?.plain_text
          : null
        : null,
    isLikeable: properties.Likeable.type === "checkbox" ? properties.Likeable.checkbox.valueOf() : false,
  }
}

export type Page = ReturnType<typeof formatPageProperties>
