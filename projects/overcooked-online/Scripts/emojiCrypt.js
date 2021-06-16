var emojiCrypt = {
	encrypt: function (string) {
		var possibleChars = "2WA1nVj0Oy3PxqXU4RfzKltaZw9ro78IGgs6hkmiMQHN5pdcLevubSYJTFBEDC";
		var skipNumber = 0;
		var newDict = [].concat(emojiDict);
		var shiftChar = newDict[Math.floor(Math.random() * 2000)];
		var encryptedString = shiftChar;
		for (var i = 0; i < string.length; i++) {
			encryptedString += newDict[possibleChars.indexOf([string[i]]) + newDict.indexOf(shiftChar)];
		}
		console.log(encryptedString);
	},
	decrypt: function (string) {
		var possibleChars = "2WA1nVj0Oy3PxqXU4RfzKltaZw9ro78IGgs6hkmiMQHN5pdcLevubSYJTFBEDC";
		var skipNumber = 0;
		var newDict = [].concat(emojiDict);
		var shiftChar = newDict[Math.floor(Math.random() * 2000)];
		var encryptedString = shiftChar;
		for (var i = 0; i < string.length; i++) {
			encryptedString += newDict[possibleChars.indexOf([string[i]]) + newDict.indexOf(shiftChar)];
		}
		console.log(encryptedString);
	}
}
emojiCrypt.encrypt("EJeS");
emojiCrypt.encrypt("X57a");
emojiCrypt.encrypt("bc2t");