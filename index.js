var _ = require('lodash'),
    request = require('request'),
    util = require('./util'),
    pickOutputs = {
        total_items: 'total_items',
        _links: '_links',
        id: { key: 'automations', fields: ['id'] },
        status: { key: 'automations', fields: ['status'] },
        emails_sent: { key: 'automations', fields: ['emails_sent'] },
        recipients: { key: 'automations', fields: ['recipients'] },
        tracking: { key: 'automations', fields: ['tracking'] },
        report_summary: { key: 'automations', fields: ['report_summary'] }
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var accessToken = dexter.provider('mailchimp').credentials('access_token');

        if (!dexter.environment('mailchimp_server'))
            return this.fail('A [mailchimp_server] environment need for this module.');

        var baseUrl = 'https://' + dexter.environment('mailchimp_server') + '.api.mailchimp.com/3.0';
        request({
            baseUrl: baseUrl,
            method: 'GET',
            uri: 'automations',
            json: true,
            auth: {
                bearer: accessToken
            }
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                this.complete(util.pickOutputs(body, pickOutputs));
            } else {
                this.fail(error || body);
            }
        }.bind(this));
    }
};
