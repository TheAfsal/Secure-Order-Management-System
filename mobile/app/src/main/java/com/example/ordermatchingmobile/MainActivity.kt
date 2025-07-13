package com.example.ordermatchingmobile

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ordermatchingmobile.ui.theme.OrderMatchingMobileTheme
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()

        super.onCreate(savedInstanceState)
        setContent {
            OrderMatchingMobileTheme {
                WebViewPage("https://hirearena.vercel.app")
            }
        }
    }
}

@Composable
fun WebViewPage(url: String) {
    AndroidView(factory = { context ->
        WebView(context).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.useWideViewPort = true
            settings.loadWithOverviewMode = true
            settings.allowContentAccess = true
            settings.allowFileAccess = true

            // Allow mixed content (HTTPS + HTTP)
            settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

            webViewClient = WebViewClient()
            loadUrl(url)
        }
    }, modifier = Modifier.fillMaxSize())
}

