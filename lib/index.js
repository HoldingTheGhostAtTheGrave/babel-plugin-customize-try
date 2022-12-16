const {  getAnnotationName , processingFunction  } = require("../utils/index");
module.exports = function ({ types: t }) {
	return {
		visitor: {
			'ArrowFunctionExpression|FunctionExpression|FunctionDeclaration|ObjectMethod': function (path , options) {
				const { globalTry = true , showName = '@babel-show-try' , hideName = '@babel-hide-try' } = options.opts; 

				const annotationName = getAnnotationName(path);
				const leadingCommentsName = annotationName ? annotationName[0].value.trim() : '';

				//  globalTry = true && 不标识 @babel-hide-try
				if(globalTry && leadingCommentsName != hideName){
					processingFunction( path, t , options.opts );
					return ;
				}
				// globalTry = false && 标识 @babel-show-try  
				if(leadingCommentsName == showName && !globalTry){
					processingFunction( path, t , options.opts );
					return ;
				}
			}
		}
	};
};