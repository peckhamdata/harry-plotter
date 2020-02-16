// Linear Congurential Generator
//
// https://en.wikipedia.org/wiki/Linear_congruential_generator
// via
// http://indiegamr.com/generate-repeatable-random-numbers-in-js/
 
// in order to work 'Math.seed' must NOT be undefined,
// so in any case, you HAVE to provide a Math.seed
lcg_sequence = function(seed, max, min, length) {
    max = max || 1;
    min = min || 0;
    var result = []
	var i=0;
	for (i=0; i < length; i++) {
	    seed = (seed * 9301 + 49297) % 233280;
	    var rnd = seed / 233280;
	 
	    result.push(min + rnd * (max - min));
	  	seed++
	}
  	return result;
 
}

module.exports = lcg_sequence 

