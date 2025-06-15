import EmailService from "ghost/core/server/services/email-service/EmailService.js";

const getDefaultExampleMember = EmailService.prototype.getDefaultExampleMember;

export default getDefaultExampleMember;
