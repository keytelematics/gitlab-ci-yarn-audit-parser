module.exports.capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.getCWEId = function(cweString) {
  return cweString.replace('CWE-','');
}

module.exports.strtr = function (string, dic) { 
  const makeToken = ( inx ) => `{{###~${ inx }~###}}`,
        
        tokens = Object.keys( dic )       
          .map( ( key, inx ) => ({
            key,
            val: dic[ key ],
            token: makeToken( inx )
          })),
            
        tokenizedStr = tokens.reduce(( carry, entry ) => 
          carry.replace( entry.key, entry.token ), string );
          
  return tokens.reduce(( carry, entry ) => 
          carry.replace( entry.token, entry.val ), tokenizedStr );
};