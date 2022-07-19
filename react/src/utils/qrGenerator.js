let asciiConverter = {
    "!":"00100001",
    "\"":"00100010",
    "#":"00100011",
    "$":"00100100",
    "%":"00100101",
    "&":"00100110",
    "'":"00100111",
    "(":"00101000",
    ")":"00101001",
    "*":"00101010",
    "+":"00101011",
    ",":"00101100",
    "-":"00101101",
    ".":"00101110",
    "/":"00101111",
    "0":"00110000",
    "1":"00110001",
    "2":"00110010",
    "3":"00110011",
    "4":"00110100",
    "5":"00110101",
    "6":"00110110",
    "7":"00110111",
    "8":"00111000",
    "9":"00111001",
    ":":"00111010",
    ";":"00111011",
    "<":"00111100",
    "=":"00111101",
    ">":"00111110",
    "?":"00111111",
    "@":"01000000",
    "A":"0100001",
    "B":"01000010",
    "C":"01000011",
    "D":"01000100",
    "E":"01000101",
    "F":"01000110",
    "G":"01000111",
    "H":"01001000",
    "I":"01001001",
    "J":"01001010",
    "K":"01001011",
    "L":"01001100",
    "M":"01001101",
    "N":"01001110",
    "O":"01001111",
    "P":"01010000",
    "Q":"01010001",
    "R":"01010010",
    "S":"01010011",
    "T":"01010100",
    "U":"01010101",
    "V":"01010110",
    "W":"01010111",
    "X":"01011000",
    "Y":"01011001",
    "Z":"01011010",
    "[":"01011011",
    "\\":"01011100",
    "]":"01011101",
    "^":"01011110",
    "_":"01011111",
    "`":"01100000",
    "a":"01100001",
    "b":"01100010",
    "c":"01100011",
    "d":"01100100",
    "e":"01100101",
    "f":"01100110",
    "g":"01100111",
    "h":"01101000",
    "i":"01101001",
    "j":"01101010",
    "k":"01101011",
    "l":"01101100",
    "m":"01101101",
    "n":"01101110",
    "o":"01101111",
    "p":"01110000",
    "q":"01110001",
    "r":"01110010",
    "s":"01110011",
    "t":"01110100",
    "u":"01110101",
    "v":"01110110",
    "w":"01110111",
    "x":"01111000",
    "y":"01111001",
    "z":"01111010",
    "{":"01111011",
    "|":"01111100",
    "}":"01111101",
    "~":"01111110"
};

let integerToAlphaConverter = {
    0:0,
    1:0,
    2:1,
    3:25,
    4:2,
    5:50,
    6:26,
    7:198,
    8:3,
    9:223,
    10:51,
    11:238,
    12:27,
    13:104,
    14:199,
    15:75,
    16:4,
    17:100,
    18:224,
    19:14,
    20:52,
    21:141,
    22:239,
    23:129,
    24:28,
    25:193,
    26:105,
    27:248,
    28:200,
    29:8,
    30:76,
    31:113,
    32:5,
    33:138,
    34:101,
    35:47,
    36:225,
    37:36,
    38:15,
    39:33,
    40:53,
    41:147,
    42:142,
    43:218,
    44:240,
    45:18,
    46:130,
    47:69,
    48:29,
    49:181,
    50:194,
    51:125,
    52:106,
    53:39,
    54:249,
    55:185,
    56:201,
    57:154,
    58:9,
    59:120,
    60:77,
    61:228,
    62:114,
    63:166,
    64:6,
    65:191,
    66:139,
    67:98,
    68:102,
    69:221,
    70:48,
    71:253,
    72:226,
    73:152,
    74:37,
    75:179,
    76:16,
    77:145,
    78:34,
    79:136,
    80:54,
    81:208,
    82:148,
    83:206,
    84:143,
    85:150,
    86:219,
    87:189,
    88:241,
    89:210,
    90:19,
    91:92,
    92:131,
    93:56,
    94:70,
    95:64,
    96:30,
    97:66,
    98:182,
    99:163,
    100:195,
    101:72,
    102:126,
    103:110,
    104:107,
    105:58,
    106:40,
    107:84,
    108:250,
    109:133,
    110:186,
    111:61,
    112:202,
    113:94,
    114:155,
    115:159,
    116:10,
    117:21,
    118:121,
    119:43,
    120:78,
    121:212,
    122:229,
    123:172,
    124:115,
    125:243,
    126:167,
    127:87,
    128:7,
    129:112,
    130:192,
    131:247,
    132:140,
    133:128,
    134:99,
    135:13,
    136:103,
    137:74,
    138:222,
    139:237,
    140:49,
    141:197,
    142:254,
    143:24,
    144:227,
    145:165,
    146:153,
    147:119,
    148:38,
    149:184,
    150:180,
    151:124,
    152:17,
    153:68,
    154:146,
    155:217,
    156:35,
    157:32,
    158:137,
    159:46,
    160:55,
    161:63,
    162:209,
    163:91,
    164:149,
    165:188,
    166:207,
    167:205,
    168:144,
    169:135,
    170:151,
    171:178,
    172:220,
    173:252,
    174:190,
    175:97,
    176:242,
    177:86,
    178:211,
    179:171,
    180:20,
    181:42,
    182:93,
    183:158,
    184:132,
    185:60,
    186:57,
    187:83,
    188:71,
    189:109,
    190:65,
    191:162,
    192:31,
    193:45,
    194:67,
    195:216,
    196:183,
    197:123,
    198:164,
    199:118,
    200:196,
    201:23,
    202:73,
    203:236,
    204:127,
    205:12,
    206:111,
    207:246,
    208:108,
    209:161,
    210:59,
    211:82,
    212:41,
    213:157,
    214:85,
    215:170,
    216:251,
    217:96,
    218:134,
    219:177,
    220:187,
    221:204,
    222:62,
    223:90,
    224:203,
    225:89,
    226:95,
    227:176,
    228:156,
    229:169,
    230:160,
    231:81,
    232:11,
    233:245,
    234:22,
    235:235,
    236:122,
    237:117,
    238:44,
    239:215,
    240:79,
    241:174,
    242:213,
    243:233,
    244:230,
    245:231,
    246:173,
    247:232,
    248:116,
    249:214,
    250:244,
    251:234,
    252:268,
    253:80,
    254:88,
    255:175
}




let alphaToIntegerConverter = {
    0:1,
    1:2,
    2:4,
    3:8,
    4:16,
    5:32,
    6:64,
    7:128,
    8:29,
    9:58,
    10:116,
    11:232,
    12:205,
    13:135,
    14:19,
    15:38,
    16:76,
    17:152,
    18:45,
    19:90,
    20:180,
    21:117,
    22:234,
    23:201,
    24:143,
    25:3,
    26:6,
    27:12,
    28:24,
    29:48,
    30:96,
    31:192,
    32:157,
    33:39,
    34:78,
    35:156,
    36:37,
    37:74,
    38:148,
    39:53,
    40:106,
    41:212,
    42:181,
    43:119,
    44:238,
    45:193,
    46:159,
    47:35,
    48:70,
    49:140,
    50:5,
    51:10,
    52:20,
    53:40,
    54:80,
    55:160,
    56:93,
    57:186,
    58:105,
    59:210,
    60:185,
    61:111,
    62:222,
    63:161,
    64:195,
    65:190,
    66:97,
    67:194,
    68:153,
    69:47,
    70:94,
    71:188,
    72:101,
    73:202,
    74:137,
    75:15,
    76:30,
    77:60,
    78:120,
    79:240,
    80:253,
    81:231,
    82:211,
    83:187,
    84:107,
    85:214,
    86:177,
    87:127,
    88:254,
    89:225,
    90:223,
    91:163,
    92:91,
    93:182,
    94:113,
    95:226,
    96:217,
    97:66,
    98:175,
    99:67,
    100:17,
    101:34,
    102:68,
    103:136,
    104:13,
    105:26,
    106:52,
    107:104,
    108:208,
    109:189,
    110:103,
    111:206,
    112:129,
    113:31,
    114:62,
    115:124,
    116:248,
    117:237,
    118:199,
    119:147,
    120:59,
    121:118,
    122:236,
    123:197,
    124:151,
    125:51,
    126:102,
    127:204,
    128:133,
    129:23,
    130:46,
    131:92,
    132:184,
    133:109,
    134:218,
    135:169,
    136:79,
    137:158,
    138:33,
    139:66,
    140:132,
    141:21,
    142:42,
    143:84,
    144:168,
    145:77,
    146:154,
    147:41,
    148:82,
    149:164,
    150:85,
    151:170,
    152:73,
    153:146,
    154:57,
    155:114,
    156:228,
    157:213,
    158:183,
    159:115,
    160:230,
    161:209,
    162:191,
    163:99,
    164:198,
    165:245,
    166:63,
    167:126,
    168:252,
    169:229,
    170:215,
    171:179,
    172:123,
    173:246,
    174:241,
    175:255,
    176:227,
    177:219,
    178:171,
    179:75,
    180:150,
    181:49,
    182:98,
    183:196,
    184:149,
    185:55,
    186:110,
    187:220,
    188:165,
    189:87,
    190:174,
    191:65,
    192:130,
    193:25,
    194:50,
    195:100,
    196:200,
    197:141,
    198:7,
    199:14,
    200:28,
    201:56,
    202:112,
    203:224,
    204:221,
    205:167,
    206:83,
    207:166,
    208:81,
    209:162,
    210:89,
    211:178,
    212:121,
    213:242,
    214:249,
    215:239,
    216:195,
    217:155,
    218:43,
    219:86,
    220:172,
    221:69,
    222:138,
    223:9,
    224:18,
    225:38,
    226:72,
    227:144,
    228:61,
    229:122,
    230:244,
    231:245,
    232:247,
    233:243,
    234:251,
    235:235,
    236:203,
    237:139,
    238:11,
    239:22,
    240:44,
    241:88,
    242:176,
    243:125,
    244:250,
    245:233,
    246:207,
    247:131,
    248:27,
    249:54,
    250:108,
    251:216,
    252:173,
    253:71,
    254:142,
    255:1
}
function intToBinary(int){
    return (int >>> 0).toString(2);
}
function binaryToInt(binary){
    return parseInt(binary, 2);
}

function decimalXOR(a, b){

    //prepare binary numbers
    let binaryA = intToBinary(a);
    let binaryB = intToBinary(b);
    if(binaryA.length< binaryB.length){
        let lengthDiff = binaryB.length - binaryA.length;
        for(let i=0;i<lengthDiff;i++){
            binaryA = "0"+binaryA;
        }
    }else if(binaryB.length<binaryA.length){
        let lengthDiff = binaryA.length - binaryB.length;
        for(let i=0;i<lengthDiff;i++){
            binaryB = "0"+binaryB;
        }
    }

    let xorResult = "";
    for(let i=0;i<binaryA.length;i++){
        if(binaryA.charAt(i) != binaryB.charAt(i)){
            xorResult+="1";
        }else{
            xorResult+="0";
        }
    }
    return binaryToInt(xorResult);
}

let stringToEncode = "https://siize/scanme/1a1k21ls0g5";

// STEP 1: choose error correction level: L(7%), M(15%), Q(25%), H(30%)
// STEP 2: choose smallest version of QR. V1 (21x21) ->+4->V40 (177x177)

//For our use-case pick qr version 3m (up to 42 char encoding).

// STEP 3: find mode indicator bits
let modeIndicator = "0100";

// STEP 4: find character cound indicator bits. Since byte mode, needs to be 8 bits long.
let characterCountIndicatorBitLength = 8;
let characterCountIndicator = intToBinary(stringToEncode.length);
for (let i = characterCountIndicator.length; i < characterCountIndicatorBitLength; i++) {
  characterCountIndicator = "0" + characterCountIndicator;
}

//STEP 5: encode actual string data, use byte-mode encoding from string to ISO 8859-1
let encodedDataContent = "";
for(let i=0;i<stringToEncode.length;i++){
    encodedDataContent+=asciiConverter[stringToEncode.charAt(i)];
}

//STEP 6: put all encoded strings together
let encodedString = modeIndicator+characterCountIndicator+encodedDataContent;


//STEP 7: find actual required nb of bits based on QR version (3-M -> 44 bytes * 8 = 352 bits)
let requiredTotalBitsQtity = 352;

//STEP 8: pad maximum of 4 zero's at right side to try to match required nb bits.
for(let i=encodedString.length, j=0;i<requiredTotalBitsQtity && j<4;i++, j++){
    encodedString+="0";
}

//STEP 9: add 0's at right side to make string length a multiple of 8.
if(encodedString.length % 8 != 0){
    let remainderToAdd = 8 - (encodedString.length % 8);
    for(let i=0;i<remainderToAdd;i++){
        encodedString+="0";
    }
}

//STEP 10: add the final pad bytes (11101100 00010001) to match required nb bits.
let requiredPadBytes = (requiredTotalBitsQtity - encodedString.length)/8;
for(let i=0;i<requiredPadBytes;i++){
    if(i%2==0){
        encodedString+="11101100";
    }else{
        encodedString+="00010001";
    }
}

//STEP 11: prepare message poly and generator poly for error correction codewords. Since 3-M, there are 26 codewords. Find messagePolynomial and generatorPolynomial.
let messagePolynomialCoefficients = [];
let messagePolynomialExponents = [];
for(let i=0, j=(encodedString.length / 8);i<encodedString.length;i+=8, j--){
    let numberToParse = encodedString.substring(i, i+8);
    messagePolynomialCoefficients.push(binaryToInt(numberToParse));
    messagePolynomialExponents.push(j-1+26);
    // +26 because we don't want exponent to become too small during division.
}
let additionalExponent = (encodedString.length / 8) - 1;
let generatorPolynomialCoefficients = [0, 173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70];
let generatorPolynomialExponents = [26+additionalExponent, 25+additionalExponent, 24+additionalExponent, 23+additionalExponent, 22+additionalExponent, 21+additionalExponent, 20+additionalExponent, 19+additionalExponent, 18+additionalExponent, 17+additionalExponent, 16+additionalExponent, 15+additionalExponent, 14+additionalExponent, 13+additionalExponent, 12+additionalExponent, 11+additionalExponent, 10+additionalExponent, 9+additionalExponent, 8+additionalExponent, 7+additionalExponent, 6+additionalExponent, 5+additionalExponent, 4+additionalExponent, 3+additionalExponent, 2+additionalExponent, 1+additionalExponent, 0+additionalExponent];











//perform division
let nbTermsMessagePoly = messagePolynomialCoefficients.length;
let xorCoeffs = [];
let multiplication1aResults = [];

//STEPS 1a)
//multiply generator poly by lead term of message poly
let leadTermMessagePoly = integerToAlphaConverter[messagePolynomialCoefficients[0]];
for(let j=0;j<generatorPolynomialCoefficients.length;j++){
    let exponentAddition = leadTermMessagePoly + generatorPolynomialCoefficients[j];
    if(exponentAddition > 255){
        exponentAddition = exponentAddition % 255;
    }
    multiplication1aResults.push(alphaToIntegerConverter[exponentAddition]);
}

//STEP 1b)
//XOR the results of message poly with multiplication alpha results
let longestLength = multiplication1aResults.length > messagePolynomialCoefficients.length ? multiplication1aResults.length : messagePolynomialCoefficients.length;    
for(let j=1;j<longestLength;j++){
    let coeff1aValue = multiplication1aResults[j] || 0;
    let coeffMessagePoly = messagePolynomialCoefficients[j] || 0;
    
    let xorResult = decimalXOR(coeff1aValue, coeffMessagePoly);
    xorCoeffs.push(xorResult);
}





for(let i=0;i<nbTermsMessagePoly-1;i++){
    //STEPS a)
    //multiply generator poly by lead term of xor coeffs
    let leadTermXor = integerToAlphaConverter[xorCoeffs[0]];
    multiplication1aResults = [];
    for(let j=0;j<generatorPolynomialCoefficients.length;j++){
        let exponentAddition = leadTermXor + generatorPolynomialCoefficients[j];
        if(exponentAddition > 255){
            exponentAddition = exponentAddition % 255;
        }
        multiplication1aResults.push(alphaToIntegerConverter[exponentAddition]);
    }

    //STEP b)
    //XOR the results of past xor coeffs with alpha expo mulitplication result
    let newXorCoeffs = [];
    let longestLength = multiplication1aResults.length > xorCoeffs.length ? multiplication1aResults.length : xorCoeffs.length;    
    //discard lead term so start at j=1;
    for(let j=1;j<longestLength;j++){
        let coeff1aValue = multiplication1aResults[j] || 0;
        let coeffXorValue = xorCoeffs[j] || 0;
        
        let xorResult = decimalXOR(coeff1aValue, coeffXorValue);
        newXorCoeffs.push(xorResult);
    }
    xorCoeffs = newXorCoeffs;
}



//merge encoded string and error codewords

for(let i=0;i<xorCoeffs.length;i++){
    encodedString+=intToBinary(xorCoeffs[i]);
}


console.log(encodedString);