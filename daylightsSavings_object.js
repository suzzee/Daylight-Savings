/*
*
*	This object calculates Daylight Savings for Greenwich Mean Time,
*	then converts to Eastern Standard Time.
*	Sample Call: daylightSavings.init(date);
*	Date/Time Format: mm/dd/yyyy hh:mm (military time)
*
*	To Do: Include check for New Year's
*
*/

var daylightSavings = {

	Results: {
		OriginalDate: "",
		Year: "",
        BegStartDay: "",
		StartMonth: "",
		StartDay: "",
        BegEndDay: "",
		EndMonth: "",
		EndDay: "",
        EPA: "",
		FullDateStart: "",
		FullDateEnd: "",
		Converted: ""
	},

	/* removed data */
	CallSummary: {
		CallReceived: "",
		Dispatched: "",
		EnRoute: "",
		AtScene: "",
		LeavingScene: "",
		AtDestination: "",
		InService: "1",
	},
	
	init: function ( pDate ) {
	
		var sDate, sYear, sTime;
		sDate       =   new Date( pDate );
		sYear       =   sDate.getFullYear();

		daylightSavings.Results.Year = sYear;
		
		if ( sYear == "" || sYear == false ) {
			pYear = daylightSavings.Year;
		}
		
		if ( sYear < 2007 ) {
			sEPA    =   false;
		} else {
			sEPA    =   true;
		}
		
		daylightSavings.Results.OriginalDate = sDate;
		daylightSavings.Results.EPA  = sEPA;
		g_oResults = daylightSavings.Results;
		daylightSavings.epaCheck( g_oResults );
		return false;
	},
	
	epaCheck: function ( g_oResults ) {

		var iStart, iEnd, iStart_month, iEnd_month, iYear, bEPA;
		
		bEPA               =  g_oResults.EPA;
		iYear              =  g_oResults.Year;
	
		if ( bEPA || bEPA == true || bEPA != "" ) {
			
			//  mar - nov
			iStart         =   new Date(iYear + "/03/01");
			iEnd           =   new Date(iYear + "/11/01");
			
			iStart_month   =   iStart.getMonth()+1;
			iEnd_month     =   iEnd.getMonth()+1;
			
		} 
		
		else if ( bEPA || bEPA == false || bEPA == "" ) {
			
			//  apr - oct
			iStart         =   new Date(iYear + "/04/01");
			iEnd           =   new Date(iYear + "/10/01");
			
			iStart_month   =   iStart.getMonth();
			iEnd_month     =   iEnd.getMonth();
			
		}
		
		daylightSavings.Results.StartMonth      =    iStart_month;
		daylightSavings.Results.BegStartDay     =    iStart;
		daylightSavings.Results.EndMonth        =    iEnd_month;
		daylightSavings.Results.BegEndDay       =    iEnd;
		
		g_oResults = daylightSavings.Results;
		daylightSavings.weekCheck( g_oResults );
		return false;
	},
	
	weekCheck: function ( g_oResults ) {

		var iDay_start, iDay_end, iDST_DayStart, iDST_DayEnd, sEPA;
		
		sEPA                    =   g_oResults.EPA;
		iDay_start              =   g_oResults.BegStartDay.getDay();
		iDay_end                =   g_oResults.BegEndDay.getDay();

		if ( sEPA == true && sEPA != "" ) {
		
			iDST_DayStart       =   1 + ( 14 - iDay_start );   /* 2nd sunday of march date  */
			iDST_DayEnd         =   1 + ( 7 - iDay_end );      /* 1st sunday of november date */
			
		} 
		
		else if ( sEPA == false ) {
		
			iDST_DayStart       =   1 + ( 7 - iDay_start );    /*  1st sunday of april date  */
			iDST_DayEnd         =   1 + ( 28 - iDay_end );     /* last sunday of october date */
		
		}

		daylightSavings.Results.StartDay = iDST_DayStart;
		daylightSavings.Results.EndDay = iDST_DayEnd;
		
		g_oResults = daylightSavings.Results;
		daylightSavings.build( g_oResults );
		return false;
	},
	
	build: function ( g_oResults ) {
	
		var sDST_fulldatestart, sDST_fulldateend;
	
		sDST_fulldatestart      =   daylightSavings.Results.StartMonth + "/" + daylightSavings.Results.StartDay + "/" + daylightSavings.Results.Year + " 02:00";
   	        sDST_fulldateend        =   daylightSavings.Results.EndMonth  + "/" + daylightSavings.Results.EndDay  + "/" + daylightSavings.Results.Year + " 02:00";
	
		daylightSavings.Results.FullDateStart   =  new Date(sDST_fulldatestart);
		daylightSavings.Results.FullDateEnd     =  new Date(sDST_fulldateend);
		
		g_oResults = daylightSavings.Results;
		daylightSavings.calculate( g_oResults );
		return false;
	},
	
	/* also calculate for GMT to EST dst */
	calculate: function ( g_oResults ) {
		
		var iFourHours, iFiveHours, iOrigDate, dDateTime, iFullDateEnd, iFiveHours;
		
		//  iOneHour           =  3600000;
		iFourHours             =  14400000;
		iFiveHours             =  18000000;
		
		iOrigDate              =  g_oResults.OriginalDate.valueOf();
		iFullDateEnd           =  g_oResults.FullDateEnd.valueOf();
		iFullDateStart         =  g_oResults.FullDateStart.valueOf();
		
		if ( iOrigDate >= iFullDateEnd || iOrigDate < iFullDateStart ) {
			dDateTime          =  iOrigDate - iFiveHours;
		} else {
			dDateTime          =  iOrigDate - iFourHours;
		}
		
		g_oResults.Converted   =  new Date(dDateTime);
		g_iConverted             = g_oResults.Converted;
		
		// return g_iConverted;
		buildDiv.init( g_iConverted, 4 );
		return false;
		
		
	}
};

var buildDiv = {

	init: function ( g_iConverted, someNumber ) {

		var div1 =  buildDiv.createElement("div", "callSummary_times");
		var div2 =  buildDiv.createElement("div", "callSummaryChild_two");
		var div3 =  buildDiv.createElement("div", "callWrapAround", "clearfix");
		
		//  div1.innerHTML(g_iConvertedDate);
		div2.appendChild(div1);
		div3.appendChild(div2);
		return div3;
	
	},
	
	createElement: function ( l_oTag, l_oId, l_oClass ) {
	
		var l_tag, l_id, l_class;
		
		l_tag = document.createElement(l_oTag);
		
		if ( l_oId ) {
			l_tag.setAttribute("id", l_oId);
		}
		
		if ( l_oClass ) {
			l_tag.setAttribute("class", l_oClass);
		}
		
		return l_tag;
		
	}
};

var g_oResults = {

}