declare module "*.hbs" {
  const template: import("handlebars").TemplateDelegate;
  export default template;
}
