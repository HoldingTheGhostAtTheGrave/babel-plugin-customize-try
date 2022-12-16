const template = require('@babel/template').default;


function getAnnotationName ( path ) {
	let note = '';
	const { node:{ type , leadingComments } , parentPath:{ parent } } = path;
	switch (type) {
		case "ObjectMethod":
			note = leadingComments;
			break;
		case "ArrowFunctionExpression":
			note = parent?.leadingComments;
			break;
		case "FunctionDeclaration":
			note = leadingComments;
			break;
		case "FunctionExpression":
			note = parent?.leadingComments;
			break;
		default:
			break;
	}
	return note ;
}

const processingFunction = (path, t , { catchs }) => {
	const { id, params, generator, async, body, type , kind , computed , key } = path.node;
	const blockStatement = path.node.body;
	let func = null;
	// 1、如果有try catch包裹了，则不需要 2、防止circle loops 
    // 3、需要try catch的只能是语句，像() => 0这种的body，是不需要的
    // 4、如果函数内容小于等于 0 行 不处理 try catch
    if (
		(blockStatement.body && t.isTryStatement(blockStatement.body[0])) || 
		(!t.isBlockStatement(blockStatement) && !t.isExpressionStatement(blockStatement)) || 
     	(blockStatement.body && blockStatement.body.length <= 0)
	) {
      return;
    }
	if (type != 'ArrowFunctionExpression') {
		// 创建 catch {  }
		let catchClause = t.catchClause(t.identifier('error'),
			t.blockStatement(
				[template.statement(catchs)()] //  catchBody
			)
		);
		// 创建 try {  }
		let tryStatement = t.tryStatement(body, catchClause);
		// 生成 ast 函数
		if(type == 'ObjectMethod'){
			func = t[type] ( kind, key, params, t.BlockStatement([tryStatement]), computed );
		}else{
			func = t[type]( id , params, t.BlockStatement([tryStatement]), generator, async);
		}
		// 替换
		path.replaceWith(func);

	} else {
		const temp = template(`
			{
				try {
					CONTENT
				} catch ( error ) {
					CATCH
				}
			}
		`);
		path.node.body = temp({
			CONTENT: body.body,
			CATCH:catchs
		});
	}
}


module.exports = { getAnnotationName , processingFunction };