/* global Comp_Info_Standalone */
; (function ($) {
    function EventObject(sender) {
        this._sender = sender;
        this._listeners = [];
    }

    EventObject.prototype = {
        attach : function (listener) {
            var listenerId = this._listeners.length;
            this._listeners.push(listener);
            return listenerId;
        },
        detach: function (listenerId) {
            if (listenerId in this._listeners) {
                delete this._listeners[listenerId];
            }
        },
        notify : function (args) {
            var i;
            for (i in this._listeners) {
                this._listeners[i](this._sender, args);
            }
        }
    };

    var inherit = (function () {
        var F = function () { };
        return function (C, P) {
            F.prototype = P.prototype;
            C.prototype = new F();
            C.uber = P.prototype;
            C.prototype.constructor = C;
        };
    }());

    // constants
    var constant = {
        sameAsBusinessContact: '-1',
        newContact: '0',
        Canada: 'Canada',
        US: 'United States',
        newBillingAccount: '0'
    };

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function ContactView(elements) {
        var self = this;
        this.$firstName = elements.$firstName;
        this.$lastName = elements.$lastName;
        this.$email = elements.$email;
        this.$summary = elements.$summary;

        this.$container = elements.$container;
        this.$contactSelect = elements.$contactSelect;

        this.$valNameContainer = elements.$valNameContainer;
        this.$valEmailContainer = elements.$valEmailContainer;

        this.selectChanged = new EventObject(this);
        this.summaryChanged = new EventObject(this);

        // attach listeners to HTML controls
        this.$contactSelect.change(function () {
            var $input = $(this);
            var selectedValue = $input.val();
            if (selectedValue === constant.newContact) {
                self.$container.show();
                self.populateSummaryFieldFromFields.call(self);
            } else {
                self.$container.hide();
                self.populateSummaryFieldFromSelect.call(self);
            }

            self.selectChanged.notify();
        })
        .change();

        function onFieldChange() {
            self.populateSummaryFieldFromFields.call(self);
        }

        this.$firstName.change(onFieldChange);
        this.$lastName.change(onFieldChange);
        this.$email.change(onFieldChange);

        this.$summary.change(function () {
            self.summaryChanged.notify(self.$summary.val());
        });
    }

    ContactView.prototype = {
        populateSummaryFieldFromFields: function () {
            var firstName = this.$firstName.val();
            var lastName = this.$lastName.val();
            var email = this.$email.val();
            var result = firstName + ' ' + lastName + ', ' + email;
            this.$summary.val(result);
            this.$summary.change();
        },

        populateSummaryFieldFromSelect: function () {
            var result = this.$contactSelect.find('option:selected').text();
            this.$summary.val(result);
            this.$summary.change();
        },

        getSummary: function () {
            return this.$summary.val();
        },

        validate: function () {
            var isValid = true;
            if (this.$contactSelect.val() === constant.newContact) {
                if (this.$firstName.val() && this.$lastName.val()) {
                    this.$valNameContainer.hide();
                } else {
                    this.$valNameContainer.show();
                    isValid = false;
                }

                if (validateEmail(this.$email.val())) {
                    this.$valEmailContainer.hide();
                } else {
                    this.$valEmailContainer.show();
                    isValid = false;
                }
            }

            return isValid;
        }
    };

    function ContactViewObservingAnotherContact(elements, observableContact) {
        var self = this;
        ContactView.apply(this, [elements]);

        this.observableContact = observableContact;

        this.$contactSelect.off();
        // attach listeners to HTML controls
        this.$contactSelect.change(function () {
            var $input = $(this);
            var selectedValue = $input.val();
            if (selectedValue === constant.newContact) {
                self.$container.show();
                self.populateSummaryFieldFromFields.call(self);
                self.observableContact.summaryChanged.detach(self.listenerId);
            } else if (selectedValue === constant.sameAsBusinessContact) {
                self.$container.hide();
                var result = self.observableContact.getSummary();
                self.$summary.val(result);

                self.listenerId = self.observableContact.summaryChanged.attach(function (contact, summaryValue) {
                    self.$summary.val(summaryValue);
                });
            } else {
                self.$container.hide();
                self.populateSummaryFieldFromSelect.call(self);
                self.observableContact.summaryChanged.detach(self.listenerId);
            }

            self.selectChanged.notify();
        })
        .change();
    }
    inherit(ContactViewObservingAnotherContact, ContactView);

    function AddressView(elements) {
        var self = this;
        this.onAddressFieldChange = new EventObject(this);
        function onFieldChange() {
            self.onAddressFieldChange.notify(self.getSummary());
        }

        this.$line1 = elements.$line1;
        this.$line2 = elements.$line2;
        this.$city = elements.$city;
        this.$coutnrySelect = elements.$coutnrySelect;
        this.$region = elements.$region;
        this.$stateSelect = elements.$stateSelect;
        this.$provinceSelect = elements.$provinceSelect;
        this.$postalCode = elements.$postalCode;

        this.$regionContainer = elements.$regionContainer;
        this.$provinceContainer = elements.$provinceContainer;
        this.$stateContainer = elements.$stateContainer;

        this.$valLine1 = elements.$valLine1;
        this.$valCity = elements.$valCity;
        this.$valCountry = elements.$valCountry;
        this.$valPostalCode = elements.$valPostalCode;
        this.$valState = elements.$valState;
        this.$valProvince = elements.$valProvince;


        this.$line1.change(onFieldChange);
        this.$line2.change(onFieldChange);
        this.$city.change(onFieldChange);
        this.$region.change(onFieldChange);
        this.$stateSelect.change(onFieldChange);
        this.$provinceSelect.change(onFieldChange);
        this.$postalCode.change(onFieldChange);

        this.$regionContainer.change(onFieldChange);
        this.$provinceContainer.change(onFieldChange);
        this.$stateContainer.change(onFieldChange);

        this.$coutnrySelect.change(function () {
            var selectedValue = self.$coutnrySelect.val();
            switch (selectedValue) {
                case constant.US:
                    self.$stateContainer.show();
                    self.$regionContainer.hide();
                    self.$provinceContainer.hide();
                    break;
                case constant.Canada:
                    self.$stateContainer.hide();
                    self.$regionContainer.hide();
                    self.$provinceContainer.show();
                    break;
                default:
                    self.$stateContainer.hide();
                    self.$regionContainer.show();
                    self.$provinceContainer.hide();
            }

            onFieldChange();
        });

        this.$coutnrySelect.change();
    }

    AddressView.prototype = {
        getSummary: function () {
            var line1 = this.$line1.val();
            var line2 = this.$line2.val();
            var city = this.$city.val();

            var region;
            var selectedCountry = this.$coutnrySelect.val();
            switch (selectedCountry) {
                case constant.US:
                    region = this.$stateSelect.val();
                    break;
                case constant.Canada:
                    region = this.$provinceSelect.val();
                    break;
                default:
                    region = this.$region.val();
            }

            var postalCode = this.$postalCode.val();

            var result = '<address>';
            if (line1) {
                result += line1 + '<br>';
            }

            if (line2) {
                result += line2 + '<br>';
            }

            if (city && postalCode) {
                result += city + ', ' + postalCode + '<br>';
            } else if (city) {
                result += city + '<br>';
            } else if (postalCode) {
                result += postalCode + '<br>';
            }

            if (region) {
                result += region + '<br>';
            }

            if (selectedCountry) {
                result += selectedCountry;
            }

            result += '</address>';

            return result;
        },

        validate: function () {
            var isValid = true;

            if (this.$line1.val()) {
                this.$valLine1.hide();
            } else {
                this.$valLine1.show();
                isValid = false;
            }

            if (this.$city.val()) {
                this.$valCity.hide();
            } else {
                this.$valCity.show();
                isValid = false;
            }

            if (this.$coutnrySelect.val()) {
                this.$valCountry.hide();
            } else {
                this.$valCountry.show();
                isValid = false;
            }

            if (this.$postalCode.val()) {
                this.$valPostalCode.hide();
            } else {
                this.$valPostalCode.show();
                isValid = false;
            }

            switch (this.$coutnrySelect.val()) {
                case constant.US:
                    if (this.$stateSelect.val()) {
                        this.$valState.hide();
                    } else {
                        this.$valState.show();
                        isValid = false;
                    }
                    break;
                case constant.Canada:
                    if (this.$provinceSelect.val()) {
                        this.$valProvince.hide();
                    } else {
                        this.$valProvince.show();
                        isValid = false;
                    }
                    break;
            }

            return isValid;
        }
    };

    function isFieldEmpty($field, errorMsgId) {
        if (!$field.val()) {
            $(errorMsgId).show();
            return true;
        } else {
            $(errorMsgId).hide();
            return false;
        }
    }

    $(document).ready(function () {
        var $formDiv = $('div#dnn_ctr2230_ModuleContent > div.form-horizontal');

        var businessContact = new ContactView({
            $firstName: $(document.getElementById(Comp_Info_Standalone.Business_First_Name)),
            $lastName: $(document.getElementById(Comp_Info_Standalone.Business_Last_Name)),
            $email: $(document.getElementById(Comp_Info_Standalone.Business_Email)),
            $summary: $(document.getElementById(Comp_Info_Standalone.Business_Contact_Summary)),
            $container: $formDiv.find('div#New_Business_Contact'),
            $contactSelect: $(document.getElementById(Comp_Info_Standalone.Business_Contact_ID)),
            $valNameContainer: $('#val_bus_name'),
            $valEmailContainer: $('#val_bus_email')
        });

        var billingContact = new ContactViewObservingAnotherContact({
            $firstName: $(document.getElementById(Comp_Info_Standalone.Billing_First_Name)),
            $lastName: $(document.getElementById(Comp_Info_Standalone.Billing_Last_Name)),
            $email: $(document.getElementById(Comp_Info_Standalone.Billing_Email)),
            $summary: $(document.getElementById(Comp_Info_Standalone.Billing_Contact_Summary)),
            $container: $formDiv.find('div#New_Billing_Contact'),
            $contactSelect: $(document.getElementById(Comp_Info_Standalone.Billing_Contact_ID)),
            $valNameContainer: $('#val_bill_name'),
            $valEmailContainer: $('#val_bill_email')
        }, businessContact);

        var technicalContact = new ContactViewObservingAnotherContact({
            $firstName: $(document.getElementById(Comp_Info_Standalone.Technical_First_Name)),
            $lastName: $(document.getElementById(Comp_Info_Standalone.Technical_Last_Name)),
            $email: $(document.getElementById(Comp_Info_Standalone.Technical_Email)),
            $summary: $(document.getElementById(Comp_Info_Standalone.Technical_Contact_Summary)),
            $container: $formDiv.find('div#New_Technical_Contact'),
            $contactSelect: $(document.getElementById(Comp_Info_Standalone.Technical_Contact_ID)),
            $valNameContainer: $('#val_tech_name'),
            $valEmailContainer: $('#val_tech_email')
        }, businessContact);

        var billingInformation = {
            billingAddress: new AddressView({
                $line1: $(document.getElementById(Comp_Info_Standalone.Order_Billing_Line_1)),
                $line2: $(document.getElementById(Comp_Info_Standalone.Order_Billing_Line_2)),
                $city: $(document.getElementById(Comp_Info_Standalone.Order_Billing_City)),
                $coutnrySelect: $(document.getElementById(Comp_Info_Standalone.Order_Billing_Country)),
                $region: $(document.getElementById(Comp_Info_Standalone.Order_Billing_Region)),
                $stateSelect: $(document.getElementById(Comp_Info_Standalone.Order_Billing_Region_US)),
                $provinceSelect: $(document.getElementById(Comp_Info_Standalone.Order_Billing_Region_CA)),
                $postalCode: $(document.getElementById(Comp_Info_Standalone.Order_Billing_Postal)),
                $regionContainer: $formDiv.find('div#Toggle_Region_Other'),
                $provinceContainer: $formDiv.find('div#Toggle_Region_CA'),
                $stateContainer: $formDiv.find('div#Toggle_Region_US'),
                $valLine1: $('#val_bill_line1'),
                $valCity: $('#val_bill_city'),
                $valCountry: $('#val_bill_country'),
                $valPostalCode: $('#val_bill_postal'),
                $valState: $('#val_bill_state'),
                $valProvince: $('#val_bill_province')
            }),

            bankAddress: new AddressView({
                $line1: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Line_1)),
                $line2: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Line_2)),
                $city: $(document.getElementById(Comp_Info_Standalone.Order_Debit_City)),
                $coutnrySelect: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Country)),
                $region: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Region)),
                $stateSelect: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Region_US)),
                $provinceSelect: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Region_CA)),
                $postalCode: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Postal)),
                $regionContainer: $formDiv.find('div#Auto_Debit_Toggle_Region_Other'),
                $provinceContainer: $formDiv.find('div#Auto_Debit_Toggle_Region_CA'),
                $stateContainer: $formDiv.find('div#Auto_Debit_Toggle_Region_US'),
                $valLine1: $('#val_auto_debit_line_1'),
                $valCity: $('#val_auto_debit_city'),
                $valCountry: $('#val_auto_debit_country'),
                $valPostalCode: $('#val_auto_debit_postal'),
                $valState: $('#val_auto_debit_region_us'),
                $valProvince: $('#val_auto_debit_region_ca')
            }),

            $summaryField: $(document.getElementById(Comp_Info_Standalone.Billing_Info_Summary)),
            $container: $formDiv.find('div#New_Billing_Account'),
            $summaryFieldContainer: $formDiv.find('div#Hide_Billing_Info_Summary'),
            $autoDebitContainer: $formDiv.find('div#Auto_Debit_Toggle'),

            $radioGroup: $(document.getElementById(Comp_Info_Standalone.Billing_Account_ID)).find('input[type="radio"]'),
            $radioGroupContainer: $(document.getElementById(Comp_Info_Standalone.Billing_Account_ID)),

            $radioGroupDebit: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Choice)).find('input[type="radio"]'),
            $radioGroupDebitContainer: $(document.getElementById(Comp_Info_Standalone.Order_Debit_Choice)),

            populateSummaryField: function () {
                var addressSummary = this.billingAddress.getSummary();
                this.$summaryField.val(addressSummary);
            },

            validate: function () {
                var isValid = true;

                var checkedBillingAddressRadio = this.$radioGroupContainer.find('input[type="radio"]:checked').val();
                if (checkedBillingAddressRadio === constant.newBillingAccount) {
                    if (!this.billingAddress.validate()) {
                        isValid = false;
                    }
                }

                if (checkedBillingAddressRadio) {
                    $('#val_bill_acct').hide();
                } else {
                    $('#val_bill_acct').show();
                    isValid = false;
                }

                var checkedAutoDebitRadio = this.$radioGroupDebitContainer.find('input[type="radio"]:checked').val();
                if (checkedAutoDebitRadio === 'Now') {
                    if (!this.bankAddress.validate()) {
                        isValid = false;
                    }

                    var $bankName = $(document.getElementById(Comp_Info_Standalone.Order_Debit_Bank));
                    if ($bankName.val()) {
                        $('#val_auto_debit_bank').hide();
                    } else {
                        $('#val_auto_debit_bank').show();
                        isValid = false;
                    }

                    var $sortCode = $(document.getElementById(Comp_Info_Standalone.Order_Debit_Routing));
                    if ($sortCode.val()) {
                        $('#val_auto_debit_routing').hide();
                    } else {
                        $('#val_auto_debit_routing').show();
                        isValid = false;
                    }

                    var $accountName = $(document.getElementById(Comp_Info_Standalone.Order_Debit_Acct_Name));
                    if ($accountName.val()) {
                        $('#val_auto_debit_acct_name').hide();
                    } else {
                        $('#val_auto_debit_acct_name').show();
                        isValid = false;
                    }

                    var $accountNumber = $(document.getElementById(Comp_Info_Standalone.Order_Debit_Acct_Num));
                    if ($accountNumber.val()) {
                        $('#val_auto_debit_acct_num').hide();
                    } else {
                        $('#val_auto_debit_acct_num').show();
                        isValid = false;
                    }
                }

                return isValid;
            },

            init: function () {
                var self = this;
               
                if (this.$radioGroup.length === 1 && this.$radioGroup.val() === constant.newBillingAccount) {
                    this.$radioGroup.prop('checked', true);
                }

                this.$radioGroup.change(function () {
                    var $checkedInput = self.$radioGroupContainer.find('input[type="radio"]:checked');
                    var selectedValue = $checkedInput.val();
                    if (selectedValue === constant.newBillingAccount) {
                        self.$container.show();
                        //self.$summaryFieldContainer.show();
                        self.listenerId = self.billingAddress.onAddressFieldChange.attach(function (address, summary) {
                            self.$summaryField.val(summary);
                        });
                        self.populateSummaryField.call(self);
                    } else {
                        self.$container.hide();
                        //self.$summaryFieldContainer.hide();
                        self.billingAddress.onAddressFieldChange.detach(self.listenerId);
                        var label = $checkedInput.next();
                        self.$summaryField.val(label.html());
                    }
                });

                this.$radioGroup.change();

                this.$radioGroupDebit.change(function () {
                    var $checkedInput = self.$radioGroupDebitContainer.find('input[type="radio"]:checked');
                    var selectedValue = $checkedInput.val();
                    switch (selectedValue) {
                        case 'Now':
                            self.$autoDebitContainer.show();
                            break;
                        case 'Later':
                            self.$autoDebitContainer.hide();
                            break;
                        case 'Never':
                            self.$autoDebitContainer.hide();
                            break;
                    }
                });
            }
        };

        billingInformation.init();

        // Validate form
        $('a.btn-success').click(function () {
            var isValid = true;

            var $contactInfo = $('div#User_Contact_Info');
            if ($contactInfo.length > 0) {
                var $firstName = $(document.getElementById(Comp_Info_Standalone.User_First_Name));
                if (isFieldEmpty($firstName, '#val_your_name')) {
                    isValid = false;
                } else {
                    var $lastName = $(document.getElementById(Comp_Info_Standalone.User_Last_Name));
                    if (isFieldEmpty($lastName, '#val_your_name')) {
                        isValid = false;
                    }
                }

                var $email = $(document.getElementById(Comp_Info_Standalone.User_Email));
                if (isFieldEmpty($email, '#val_your_email')) {
                    isValid = false;
                }

                if (!validateEmail($email.val())) {
                    isValid = false;
                    $('#val_your_email').show();
                }
            }

            var $industry = $(document.getElementById(Comp_Info_Standalone.Order_Industry));
            if (isFieldEmpty($industry, '#val_industry')) {
                isValid = false;
            }

            var $licEntity = $(document.getElementById(Comp_Info_Standalone.Order_Licensing_Entity));
            if (isFieldEmpty($licEntity, '#val_lic_entity')) {
                isValid = false;
            }

            if (!businessContact.validate()) {
                isValid = false;
            }
                 
            if (!billingContact.validate()) {
                isValid = false;
            }

            if (!technicalContact.validate()) {
                isValid = false;
            }

            if (!billingInformation.validate()) {
                isValid = false;
            }

            if (!isValid) {
                $('#val_failed').show();
            }

            return isValid;
        });
    });
})(jQuery);
