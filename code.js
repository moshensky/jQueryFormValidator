; (function ($) {
    function EventObject(sender) {
        this._sender = sender;
        this._listeners = [];
    }

    EventObject.prototype = {
        attach : function (listener) {
            this._listeners.push(listener);
        },
        notify : function (args) {
            var index;

            for (index = 0; index < this._listeners.length; index += 1) {
                this._listeners[index](this._sender, args);
            }
        }
    };    


    // constants
    var constant = {
        sameAsBusinessContact: '-1',
        newContact: '0',
        Canada: 'Canada',
        US: 'United States',
        newBillingAccount: '0'
    };


    $(document).ready(function () {
        var $formDiv = $('div#dnn_ctr2230_ModuleContent > div.form-horizontal');

        //#region Variable declarations
        // variables


        var $billingContactSummaryField = $(document.getElementById(Comp_Info_Standalone.Billing_Contact_Summary));
        var $billingContactFirstName = $(document.getElementById(Comp_Info_Standalone.Billing_First_Name));
        var $billingContactLastName = $(document.getElementById(Comp_Info_Standalone.Billing_Last_Name));
        var $billingContactEmail = $(document.getElementById(Comp_Info_Standalone.Billing_Email));

        var $newBillingContact = $formDiv.find('div#New_Billing_Contact');
        var $billingContactSelect = $(document.getElementById(Comp_Info_Standalone.Billing_Contact_ID));

        var $technicalContactSummaryField = $(document.getElementById(Comp_Info_Standalone.Technical_Contact_Summary));
        var $technicalContactFirstName = $(document.getElementById(Comp_Info_Standalone.Technical_First_Name));
        var $technicalContactLastName = $(document.getElementById(Comp_Info_Standalone.Technical_Last_Name));
        var $technicalContactEmail = $(document.getElementById(Comp_Info_Standalone.Technical_Email));

        var $newTechnicalContact = $formDiv.find('div#New_Technical_Contact');
        var $technicalContactContactSelect = $(document.getElementById(Comp_Info_Standalone.Technical_Contact_ID));

        var $billingInformationSummaryField = $(document.getElementById(Comp_Info_Standalone.Billing_Info_Summary));
        var $biLine1 = $(document.getElementById(Comp_Info_Standalone.Order_Billing_Line_1));
        var $biLine2 = $(document.getElementById(Comp_Info_Standalone.Order_Billing_Line_2));
        var $biCity = $(document.getElementById(Comp_Info_Standalone.Order_Billing_City));

        var $biRegion = $(document.getElementById(Comp_Info_Standalone.Order_Billing_Region));
        var $biStateSelect = $(document.getElementById(Comp_Info_Standalone.Order_Billing_Region_US));
        var $biProvinceSelect = $(document.getElementById(Comp_Info_Standalone.Order_Billing_Region_CA));

        var $biPostal = $(document.getElementById(Comp_Info_Standalone.Order_Billing_Postal));
        var $country = $(document.getElementById(Comp_Info_Standalone.Order_Billing_Country));

        var $newBillingAccount = $formDiv.find('div#New_Billing_Account');
        var $billingInformationRadioGroup = $(document.getElementById(Comp_Info_Standalone.Billing_Account_ID)).find('input[type="radio"]');

        var $region = $formDiv.find('div#Toggle_Region_Other');
        var $province = $formDiv.find('div#Toggle_Region_CA');
        var $state = $formDiv.find('div#Toggle_Region_US');
        //#endregion

        // if "same as business contact is selected
        function updateSummaryFields() {
            var result = $businessContactSummaryField.val();
            var bcValue = $billingContactSelect.val();
            if (bcValue === constant.sameAsBusinessContact) {
                $billingContactSummaryField.val(result);
            }
            var tcValue = $technicalContactContactSelect.val();
            if (tcValue === constant.sameAsBusinessContact) {
                $technicalContactSummaryField.val(result);
            }
        }



        //endregion

        //#region 1. Business Contact New/Existing
        /*
         * a. After the page loads, if Business Contact dropdown ("Comp_Info_Standalone.Business_Contact_ID") is set to New Contact, 
         *    then Name and Email section should be shown (div to toggle is "New_Business_Contact").  If Business Contact field is set to anything else, 
          *   then Name and Email section should be hidden.
         * b. On change of the Business Contact field, the Name and Email section should be shown when New Contact and otherwise hidden.
         */

        //#region 5. Business Contact Summary Field
        /*
         * a. The Business Contact Summary field ("Comp_Info_Standalone.Business_Contact_Summary") should be populated after 
         *    the page loads and updated if any of the Business Contact fields change.  If Business Contact field is New Contact,
         *    the Summary field should be populated with "[First Name] [Last Name], [Email]".  If Business Contact field has a 
         *    contact selected, then the displayed text (e.g. "John Doe, jdoe@test.com") should populate the Summary field.
         */

        function ContactView(elements) {
            var self = this;
            this.$firstName = elements.$firstName;
            this.$lastName = elements.$lastName;
            this.$email = elements.$email;
            this.$summary = elements.$summary;

            this.$container = elements.$container;
            this.$contactSelect = elements.$contactSelect;

            this.selectChanged = new Event(this);
            this.summaryChanged = new Event(this);

            // attach listeners to HTML controls
            this.$contactSelect.change(function () {
                var $input = $(this);
                var selectedValue = $input.val();
                if (selectedValue === constant.newContact) {
                    self.$container.show();
                } else {
                    self.$container.hide();
                }

                self.selectChanged.notify();
                console.log('here');
            });

            this.$firstName.change(this.populateSummary.call(this))
                .change();
            this.$lastName.change(this.populateSummary.call(this))
                .change();
            this.$email.change(this.populateSummary.call(this))
                .change();

            this.$summary.change(function () {
                self.summaryChanged.notify();
            });
        }


        ContactView.prototype = {
            populateSummary: function() {
                var firstName = this.$firstName.val();
                console.log('here inside');
                console.log(this);
                var lastName = this.$lastName.val();
                var email = this.$email.val();
                var result = firstName + ' ' + lastName + ', ' + email;
                this.summary.val(result);
                this.summary.change();
            }
        }


        var businessContact = new ContactView({
            $firstName: $(document.getElementById(Comp_Info_Standalone.Business_First_Name)),
            $lastName: $(document.getElementById(Comp_Info_Standalone.Business_Last_Name)),
            $email: $(document.getElementById(Comp_Info_Standalone.Business_Email)),
            $summary: $(document.getElementById(Comp_Info_Standalone.Business_Contact_Summary)),
            $container: $formDiv.find('div#New_Business_Contact'),
            $contactSelect: $(document.getElementById(Comp_Info_Standalone.Business_Contact_ID))
        });

        /*
        toggleElement($businessContactSelect, $newBusinessContact, function (selectedValue, $select) {
            if (selectedValue === constant.newContact) {
                populateBusinessContactSummaryField();
            } else {
                var result = $select.find('option:selected').text();
                $businessContactSummaryField.val(result);
                $businessContactSummaryField.change();
            }
        });
        $businessContactSelect.change();
        */
        //#endregion

        //#region 6. Billing Contact Summary Field
        /* 
         * a. The Billing Contact Summary field ("Comp_Info_Standalone.Billing_Contact_Summary")should be populated after the
         *    page loads and updated if any of the Billing Contact fields change.  If Billing Contact field is New Contact,
         *    the Summary field should be populated with "[First Name] [Last Name], [Email]".  If Billing Contact field has a contact selected, 
         *    then the displayed text (e.g. "John Doe, jdoe@test.com") should populate the Summary field.  If Billing Contact field is Same as 
         *    Business Contact, then the displayed text (e.g. "John Doe, jdoe@test.com") from the *Business Contact* should be populated in the Summary.
         */

        function populateBillingContactSummaryField() {
            var firstName = $billingContactFirstName.val();
            var lastName = $billingContactLastName.val();
            var email = $billingContactEmail.val();
            var result = firstName + ' ' + lastName + ', ' + email;
            $billingContactSummaryField.val(result);
        }

        $billingContactFirstName.change(populateBillingContactSummaryField).change();
        $billingContactLastName.change(populateBillingContactSummaryField).change();
        $billingContactEmail.change(populateBillingContactSummaryField).change();
        //#endregion

        //#region 2. Billing Contact New/Existing
        /*
         * a. After the page loads, if Billing Contact dropdown ("Comp_Info_Standalone.Billing_Contact_ID") is set to New Contact, 
         *    then Name and Email section should be shown (div to toggle is "New_Billing_Contact").  If Billing Contact field is set to anything else, 
         *    then Name and Email section should be hidden.
         * b. On change of the Billing Contact field, the Name and Email section should be shown when New Contact and otherwise hidden.
         */
        toggleElement($billingContactSelect, $newBillingContact, function (selectedValue, $select) {
            var result;
            if (selectedValue === constant.newContact) {
                populateBillingContactSummaryField();
            } else if (selectedValue === constant.sameAsBusinessContact) {
                result = $businessContactSummaryField.val();
                $billingContactSummaryField.val(result);
            } else {
                result = $select.find('option:selected').text();
                $billingContactSummaryField.val(result);
            }
        });
        $billingContactSelect.change();
        //#endregion
        
        //#region 7. Technical Contact Summary Field
        /* 
         * a. The Technical Contact Summary field ("Comp_Info_Standalone.Technical_Contact_Summary") should be populated after the page 
         *    loads and updated if any of the Technical Contact fields change.  If Technical Contact field is New Contact, the Summary field 
         *    should be populated with "[First Name] [Last Name], [Email]".  If Technical Contact field has a contact selected, then the
         *    displayed text (e.g. "John Doe, jdoe@test.com") should populate the Summary field.  If Technical Contact field is Same as Business 
         *    Contact, then the displayed text (e.g. "John Doe, jdoe@test.com") from the *Business Contact* should be populated in the Summary.
         */
        function populateTechnicalContactSummaryField() {
            var firstName = $technicalContactFirstName.val();
            var lastName = $technicalContactLastName.val();
            var email = $technicalContactEmail.val();
            var result = firstName + ' ' + lastName + ', ' + email;
            $technicalContactSummaryField.val(result);
        }

        $technicalContactFirstName.change(populateTechnicalContactSummaryField).change();
        $technicalContactLastName.change(populateTechnicalContactSummaryField).change();
        $technicalContactEmail.change(populateTechnicalContactSummaryField).change();
        //#endregion

        //#region 3. Technical Contact New/Existing
        /*
         * a. After the page loads, if Technical Contact dropdown ("Comp_Info_Standalone.Technical_Contact_ID") is set to New Contact,
         *    then Name and Email section should be shown (div to toggle is "New_Technical_Contact").  If Technical Contact field is set to anything else, 
         *    then Name and Email section should be hidden.
         * b. On change of the Technical Contact field, the Name and Email section should be shown when New Contact and otherwise hidden.
         */
        toggleElement($technicalContactContactSelect, $newTechnicalContact, function (selectedValue, $select) {
            var result;
            if (selectedValue === constant.newContact) {
                populateTechnicalContactSummaryField();
            } else if (selectedValue === constant.sameAsBusinessContact) {
                result = $businessContactSummaryField.val();
                $technicalContactSummaryField.val(result);
            } else {
                result = $select.find('option:selected').text();
                $technicalContactSummaryField.val(result);
            }
        });
        $technicalContactContactSelect.change();
        //endregion

        //#region 8. Billing Information Summary Field
        /* 
         * a. The Billing Information Summary field ("Comp_Info_Standalone.Billing_Info_Summary") should be populated after 
         *    the page loads and updated if any of the Billing Information fields change.  If Billing Information Radio field 
         *    is set to New Billing Account, then the Summary field should be populated with 
         *    "[Line 1][\n][Line 2][\n][City], [Region][State][Province] [Postal][\n][Country]".  
         *    (where [\n] is line break).  If Billing Information Radio field is set to an existing billing account 
         *    (e.g. "ACCT-A100001") then the entired displayed address should be populated in the Billing Info Summary with line breaks intact.
         */
        function populateBillingInformationSummaryField() {
            var line1 = $biLine1.val();
            var line2 = $biLine2.val();
            var city = $biCity.val();

            var region;
            var selectedCountry = $country.val();
            switch (selectedCountry) {
                case constant.US:
                    region = $biStateSelect.val();
                    break;
                case constant.Canada:
                    region = $biProvinceSelect.val();
                    break;
                default:
                    region = $biRegion.val();
            }

            var postalCode = $biPostal.val();

            var result = line1 + '\n' + line2 + '\n' + city + ', ' + region + ' ' + postalCode + '\n' + selectedCountry;
            $billingInformationSummaryField.val(result);
        }

        $biLine1.change(populateBillingInformationSummaryField);
        //$biLine1.change();
        $biLine2.change(populateBillingInformationSummaryField);
        //$biLine2.change();
        $biCity.change(populateBillingInformationSummaryField);
        //$biCity.change();
        $biRegion.change(populateBillingInformationSummaryField);
        //$biRegion.change();
        $biStateSelect.change(populateBillingInformationSummaryField);
        //$biStateSelect.change();
        $biProvinceSelect.change(populateBillingInformationSummaryField);
        //$biProvinceSelect.change();
        $biPostal.change(populateBillingInformationSummaryField);
        //$biPostal.change();
        $country.change(populateBillingInformationSummaryField);
        $country.change();
        //endregion

        //#region 4. Billing Information New/Existing
        /*
         * a. After the page loads, if Billing Information Radio field ("Comp_Info_Standalone.Billing_Account_ID") is set to New Billing Account, 
         *    then the form fields should be shown (div to toggle is "New_Billing_Account").  If Billing Information Radio field is set to anything else, 
         *    then the form fields should be hidden.
         * b. On change of the Billing Information Radio field, the form fields section should be shown when New Billing Account and otherwise hidden.
         * c. After the page loads, if Country ("Comp_Info_Standalone.Order_Billing_Country") is set to United States, 
         *    then the Region and Province fields should be hidden; If Country is set to Canada, then the Region and State fields should be hidden; 
         *    If Country is set to something other than United States or Canada, then the State and Province fields should be hidden.  
         *    (divs to toggle: "Toggle_Region_Other" for Region; "Toggle_Region_US" for State; "Toggle_Region_CA" for Province)
         * d. On change of the Country field: if Country is set to United States, then the Region and Province fields should be hidden; 
         *    If Country is set to Canada, then the Region and State fields should be hidden; If Country is set to something other than United States or Canada, 
         *    then the State and Province fields should be hidden.
         */
        toggleElement($billingInformationRadioGroup, $newBillingAccount, function (selectedValue, $radio) {
            if (selectedValue === constant.newBillingAccount) {
                populateBillingInformationSummaryField();
            } else {
                var label = $radio.next().clone();
                var address = label.children('address').html();
                label.children('address').remove();
                var first = label.text();
                if (address) {
                    var regex = /<br\s*[\/]?>/gi;
                    address = address.replace(regex, '\n');
                    $billingInformationSummaryField.val(first + '\n' + address);
                } else {
                    $billingInformationSummaryField.val(first);
                }
            }
        });

        var $billingInformationRadioButtons = $(document.getElementById(Comp_Info_Standalone.Billing_Account_ID));

        var $radioButtonToCheck = $billingInformationRadioButtons.find('input[type="radio"]');
        if ($radioButtonToCheck.length === 1 && $radioButtonToCheck.val() === constant.newBillingAccount) {
            $radioButtonToCheck.prop('checked', true);
        }

        var checkedInput = $billingInformationRadioButtons.find('input[type="radio"]:checked');

        $country.change(function () {
            var selectedValue = $country.val();
            switch (selectedValue) {
                case constant.US:
                    $state.show();
                    $region.hide();
                    $province.hide();
                    break;
                case constant.Canada:
                    $state.hide();
                    $region.hide();
                    $province.show();
                    break;
                default:
                    $state.hide();
                    $region.show();
                    $province.hide();
            }
        });

        $country.change();
        checkedInput.change();
        //endregion

        //#region 9. Validation
        /*
         * a. On submit of the page, there should be client-side validation to ensure that the required fields are populated.  
         *    Each failed validation should display the appropriate help message.
         * b. If the "Your Name" and "Your Email" fields are shown, they are required (they are only shown to unauthenticated users)
         * c. If Business Contact is New, the Name fields and Email field must be populated.
         * d. If Billing Contact is New, the Name fields and Email field must be populated.
         * e. If Technical Contact is New, the Name fields and Email field must be populated.
         * f. If Billing Information is New Billing Account, the following fields must be populated: 
         *    Line 1, City, Country, Region/State/Province depending on which is shown, Postal Code
         */
        var $submitBtn = $('a.btn-success');

        function isFieldEmpty($field, errorMsgId) {
            if (!$field.val()) {
                $(errorMsgId).show();
                return true;
            } else {
                $(errorMsgId).hide();
                return false;
            }
        }

        $submitBtn.click(function (event) {
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
            }

            if ($businessContactSelect.val() === constant.newContact) {
                if (isFieldEmpty($businessContactFirstName, '#val_bus_name')) {
                    isValid = false;
                } else if (isFieldEmpty($businessContactLastName, '#val_bus_name')) {
                    isValid = false;
                }

                if (isFieldEmpty($businessContactEmail, '#val_bus_email')) {
                    isValid = false;
                }
            }

            if ($billingContactSelect.val() === constant.newContact) {
                if (isFieldEmpty($billingContactFirstName, '#val_bill_name')) {
                    isValid = false;
                } else if (isFieldEmpty($billingContactLastName, '#val_bill_name')) {
                    isValid = false;
                }

                if (isFieldEmpty($billingContactEmail, '#val_bill_email')) {
                    isValid = false;
                }
            }

            if ($technicalContactContactSelect.val() === constant.newContact) {
                if (isFieldEmpty($technicalContactFirstName, '#val_tech_name')) {
                    isValid = false;
                } else if (isFieldEmpty($technicalContactLastName, '#val_tech_name')) {
                    isValid = false;
                }

                if (isFieldEmpty($technicalContactEmail, '#val_tech_email')) {
                    isValid = false;
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

            var checkedBillingAddressRadio = $(document.getElementById(Comp_Info_Standalone.Billing_Account_ID)).find('input[type="radio"]:checked').val();
            if (checkedBillingAddressRadio === constant.newBillingAccount) {
                if (isFieldEmpty($biLine1, '#val_bill_line1')) {
                    isValid = false;
                }

                if (isFieldEmpty($biCity, '#val_bill_city')) {
                    isValid = false;
                }

                if (isFieldEmpty($country, '#val_bill_country')) {
                    isValid = false;
                }

                if (isFieldEmpty($biPostal, '#val_bill_postal')) {
                    isValid = false;
                }

                switch ($country.val()) {
                    case constant.US:
                        if (isFieldEmpty($biStateSelect, '#val_bill_state')) {
                            isValid = false;
                        }
                        break;
                    case constant.Canada:
                        if (isFieldEmpty($biProvinceSelect, '#val_bill_province')) {
                            isValid = false;
                        }
                        break;
                }

            } else {
                if (checkedBillingAddressRadio) {
                    $('#val_bill_acct').hide();
                } else {
                    $('#val_bill_acct').show();
                    isValid = false;
                }
            }

            if (!isValid) {
                $('#val_failed').show();
                return false;
            }
        });
        //endregion
    });
})(jQuery);
