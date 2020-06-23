const nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "agac.ufms@hotmail.com",
        pass: "wxu9wmjyl8A"
    },
    tls: {
        ciphers: 'SSLv3'
    }
})

module.exports = function (params) {
    this.from = 'Ambiente de Gerenciamento de Atividades Complementares <agac.ufms@hotmail.com>';

    this.send = function () {
        var options = {
            from: this.from,
            to: params.to,
            subject: params.subject,
            text: params.message,
            html: params.html
        };

        transporter.sendMail(options, function (err, suc) {
            err ? params.errorCallback(err) : params.successCallback(suc);
        });
    }
}