import type { NewsletterKnownFields } from "@ghost-render/email-renderer";
import makeFields from "../makeFields";

export interface NewsletterObject {
  sender_reply_to: string;
  button_corners?: string | undefined | null;
  button_style?: string | undefined | null;
  title_font_weight?:
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | (string & {})
    | null;
  link_style?: string | undefined | null;
  image_corners?: string | undefined | null;
  post_title_color?: "accent" | "auto" | (string & {}) | null;
  section_title_color?: "accent" | "auto" | (string & {}) | null;
  uuid: string;
  background_color: "light" | "dark" | (string & {}) | null;
  sender_name: string;
  sender_email: string;
  divider_color?: string | undefined | null;
  header_image?: string | undefined | null;
  show_latest_posts: boolean;
  title_alignment?: string | undefined | null;
  body_font_category?: string | undefined | null;
  title_font_category?: string | undefined | null;
  name: string;
  show_post_title_section: boolean;
  show_excerpt: boolean;
  show_comment_cta: boolean;
  show_subscription_details: boolean;
  feedback_enabled?: boolean | undefined | null;
  show_badge: boolean;
  show_header_icon: boolean;
  show_header_title: boolean;
  show_header_name: boolean;
  show_feature_image: boolean;
  footer_content?: string | undefined | null;
}

export default class NewsletterModel extends makeFields<
  NewsletterKnownFields,
  NewsletterObject
>({
  sender_reply_to: (v) => v.sender_reply_to,
  button_corners: (v) => v.button_corners,
  button_style: (v) => v.button_style,
  title_font_weight: (v) => v.title_font_weight ?? null,
  link_style: (v) => v.link_style,
  image_corners: (v) => v.image_corners,
  post_title_color: (v) => v.post_title_color ?? null,
  section_title_color: (v) => v.section_title_color ?? null,
  uuid: (v) => v.uuid,
  background_color: (v) => v.background_color,
  sender_name: (v) => v.sender_name,
  sender_email: (v) => v.sender_email,
  divider_color: (v) => v.divider_color,
  header_image: (v) => v.header_image,
  show_latest_posts: (v) => v.show_latest_posts,
  title_alignment: (v) => v.title_alignment,
  body_font_category: (v) => v.body_font_category,
  title_font_category: (v) => v.title_font_category,
  name: (v) => v.name,
  show_post_title_section: (v) => v.show_post_title_section,
  show_excerpt: (v) => v.show_excerpt,
  show_comment_cta: (v) => v.show_comment_cta,
  show_subscription_details: (v) => v.show_subscription_details,
  feedback_enabled: (v) => v.feedback_enabled,
  show_badge: (v) => v.show_badge,
  show_header_icon: (v) => v.show_header_icon,
  show_header_title: (v) => v.show_header_title,
  show_header_name: (v) => v.show_header_name,
  show_feature_image: (v) => v.show_feature_image,
  footer_content: (v) => v.footer_content,
}) {}
