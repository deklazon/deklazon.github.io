(function () {

	var iap = {};
	iap.listener = null;
	iap.RegisterCallback = function(callback) {
		iap.listener = callback;
	};
	iap.AppControlReplyCB = {
		// Reply is sent if the requested operation is successfully delivered
		onsuccess : function(reply) {
			if (reply != null) {
				var data = {};
				var i;
				var length = reply.length;
				for (i = 0; i < length; i++) {
					data[reply[i].key] = reply[i].value;
				}
				if (data._method == 'OnPurchaseItemInitialized') {
					console.log('OnPurchaseItemInitialized');
					iap.OnPurchaseItemInitialized(data);
				} else if (data._method == 'OnPurchaseItemFinished') {
					console.log('OnPurchaseItemFinished');
					iap.OnPurchaseItemFinished(data);
				} else if (data._method == 'OnItemInformationListReceived') {
					console.log('OnItemInformationListReceived');
					iap.OnItemInformationListReceived(data);
				} else if (data._method == 'OnPurchasedItemInformationListReceived') {
					console.log('OnPurchasedItemInformationListReceived')
					iap.OnPurchasedItemInformationListReceived(data);
				} else if (data._method == 'OnCountryListReceived') {
					console.log('OnCountryListReceived');
					iap.OnCountryListReceived(data);
				} else {
					console.log('error: ' + data._method);
				}

			}
		}
	};

	iap.SendAppControl = function(operation, applicationId, appControlData,
			appControlReplyCB) {
		var pAppControl = new tizen.ApplicationControl(operation, null, null, null,
				appControlData);
		tizen.application.launchAppControl(pAppControl, applicationId, function() {
			console.log("success")
		}, function() {
			console.log("fail")
		}, appControlReplyCB);
	};

	iap.RequestItemInformationList = function(data, startNum, endNum) {
		var pAppControlData = [
				new tizen.ApplicationControlData('_transactionId',
						[ data['_transactionId'] ]),
				new tizen.ApplicationControlData('_startNumber',
						[ data['_startNumber'] ]),
				new tizen.ApplicationControlData('_endNumber',
						[ data['_endNumber'] ]),
				new tizen.ApplicationControlData('_itemGroupId',
						[ data['_itemGroupId'] ]),
				new tizen.ApplicationControlData('_mcc', [ data['_mcc'] ]),
				new tizen.ApplicationControlData('_mnc', [ data['_mnc'] ]),
				new tizen.ApplicationControlData('_deviceModel',
						[ data['_deviceModel'] ]),
				new tizen.ApplicationControlData('_mode', [ data['_mode'] ]) ];
		iap.SendAppControl('http://tizen.org/appcontrol/operation/iap/get_item_list',
				'tizeninapp.IapService', pAppControlData, iap.AppControlReplyCB);
	};

	iap.RequestPurchasedItemInformationList = function(data, startNum, endNum) {
		var pAppControlData = [
				new tizen.ApplicationControlData('_transactionId',
						[ data['_transactionId'] ]),
				new tizen.ApplicationControlData('_startNumber',
						[ data['_startNumber'] ]),
				new tizen.ApplicationControlData('_endNumber',
						[ data['_endNumber'] ]),
				new tizen.ApplicationControlData('_itemGroupId',
						[ data['_itemGroupId'] ]),
				new tizen.ApplicationControlData('_mcc', [ data['_mcc'] ]),
				new tizen.ApplicationControlData('_mnc', [ data['_mnc'] ]),
				new tizen.ApplicationControlData('_deviceModel',
						[ data['_deviceModel'] ]),
				new tizen.ApplicationControlData('_mode', [ data['_mode'] ]) ];
		iap.SendAppControl('http://tizen.org/appcontrol/operation/iap/get_purchased_item_list',
				'tizeninapp.IapService', pAppControlData, iap.AppControlReplyCB);
	};

	iap.RequestPurchaseItem = function(data) {
		var pAppControlData = [
				new tizen.ApplicationControlData('_mcc', [ data['_mcc'] ]),
				new tizen.ApplicationControlData('_mnc', [ data['_mnc'] ]),
				new tizen.ApplicationControlData('_mode', [ data['_mode'] ]),
				new tizen.ApplicationControlData('_deviceModel',
						[ data['_deviceModel'] ]),
				new tizen.ApplicationControlData('_itemId', [ data['_itemId'] ]),
				new tizen.ApplicationControlData('_itemGroupId',
						[ data['_itemGroupId'] ]),
				new tizen.ApplicationControlData('_transactionId',
						[ data['_transactionId'] ]),

		];

		iap.SendAppControl('http://tizen.org/appcontrol/operation/iap/purchase',
				'tizeninapp.IapClient', pAppControlData, iap.AppControlReplyCB);
	};

	iap.RequestGetCountryList = function(data) {
		var pAppControlData = [ new tizen.ApplicationControlData('_transactionId',
				[ data['_transactionId'] ]) ];
		iap.SendAppControl('http://tizen.org/appcontrol/operation/iap/get_country_list',
				'tizeninapp.IapService', pAppControlData, iap.AppControlReplyCB);
	};

	iap.OnItemInformationListReceived = function(data) {
		iap.listener.OnItemInformationListReceived(data._transactionId,
				data._result, data);
	};
	iap.OnPurchasedItemInformationListReceived = function(data) {
		iap.listener.OnPurchasedItemInformationListReceived(data._transactionId,
				data._result, data);

	};

	iap.OnPurchaseItemFinished = function(data) {
		iap.listener
				.OnPurchaseItemFinished(data._transactionId, data._result, data);

	};
	iap.OnPurchaseItemInitialized = function(data) {
		if (iap.listener.OnPurchaseItemInitialized(data._transactionId,
				data._result, data)) {
			var pAppControlData = [
					new tizen.ApplicationControlData('_itemId', [ data['_itemId'] ]),
					new tizen.ApplicationControlData('_transactionId',
							[ data['_transactionId'] ]),
					new tizen.ApplicationControlData('_purchaseResume', [ 1 ]) ];
			iap.SendAppControl('http://tizen.org/appcontrol/operation/iap/purchase',
					'tizeninapp.IapClient', pAppControlData, iap.AppControlReplyCB);
		}
	};
	iap.OnCountryListReceived = function(data) {
		iap.listener.OnCountryListReceived(data._transactionId, data._result, data);
	};
	
	window["tizen_iap"] = iap;
})();