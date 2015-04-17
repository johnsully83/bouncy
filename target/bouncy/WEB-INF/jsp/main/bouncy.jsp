<!DOCTYPE html>	
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Bouncy</title>
	
	<script type="text/javascript" src="/javascript/library/jquery/jquery.min.js"></script>
	<script type="text/javascript" src="/javascript/library/jquery/drag/jquery.event.drag.js"></script>
	<script type="text/javascript" src="/javascript/library/jquery/drag/jquery.event.drag.live.js"></script>
	<script type="text/javascript" src="/javascript/library/jquery/drop/jquery.event.drop.js"></script>
	<script type="text/javascript" src="/javascript/library/jquery/drop/jquery.event.drop.live.js"></script>
	<script type="text/javascript" src="/javascript/bouncy/bouncy.js"></script>
	<link rel="stylesheet" type="text/css" href="/css/bouncy/bouncy.css" />
</head>
<body>
	<ul>
	   	<li class="ball drop red"></li>
		<li class="ball drop green"></li>
		<li class="ball drop blue"></li>
		<li class="ball drop orange"></li>
		<li class="ball drop purple"></li>
	</ul>
	<div id="scoreboard">
		<table>
			<tbody>
				<tr>
					<td>
						Score:
					</td>
					<td id="score">
						0
					</td>
				</tr>
				<tr>
					<td>
						Level:
					</td>
					<td id="level">
						1
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</body>
</html>