"""
TraducXion Python SDK
Version: 1.0.0
"""

import requests
import json
from typing import Dict, Optional, List, Any
from pathlib import Path
import time


class TraducXionSDK:
    """SDK Python pour l'API TraducXion"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.traducxion.com/v1"):
        """
        Initialise le SDK TraducXion
        
        Args:
            api_key: Clé API pour l'authentification
            base_url: URL de base de l'API
        """
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "X-SDK-Version": "1.0.0",
            "X-SDK-Language": "Python"
        })
    
    def transcribe(self, 
                   file_path: str, 
                   language: str = "fr",
                   engine: Optional[str] = None,
                   sector: Optional[str] = None,
                   features: Optional[Dict[str, bool]] = None) -> Dict[str, Any]:
        """
        Transcrit un fichier audio ou vidéo
        
        Args:
            file_path: Chemin vers le fichier à transcrire
            language: Langue du fichier (défaut: fr)
            engine: Moteur de transcription à utiliser
            sector: Secteur pour optimisation (medical, legal, education, business)
            features: Fonctionnalités additionnelles
            
        Returns:
            Résultat de la transcription
        """
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {
                'language': language,
                'engine': engine,
                'sector': sector
            }
            
            if features:
                data.update({f'features[{k}]': v for k, v in features.items()})
            
            response = self.session.post(
                f"{self.base_url}/transcribe",
                files=files,
                data=data
            )
            
        response.raise_for_status()
        return response.json()
    
    def transcribe_from_url(self, 
                           url: str,
                           language: str = "fr",
                           **kwargs) -> Dict[str, Any]:
        """
        Transcrit depuis une URL (YouTube, Vimeo, etc.)
        
        Args:
            url: URL de la vidéo/audio
            language: Langue du contenu
            **kwargs: Options supplémentaires
            
        Returns:
            Résultat de la transcription
        """
        data = {
            "url": url,
            "language": language,
            **kwargs
        }
        
        response = self.session.post(
            f"{self.base_url}/transcribe/url",
            json=data
        )
        
        response.raise_for_status()
        return response.json()
    
    def get_transcription_status(self, transcription_id: str) -> Dict[str, Any]:
        """
        Obtient le statut d'une transcription
        
        Args:
            transcription_id: ID de la transcription
            
        Returns:
            Statut de la transcription
        """
        response = self.session.get(
            f"{self.base_url}/transcriptions/{transcription_id}"
        )
        
        response.raise_for_status()
        return response.json()
    
    def wait_for_transcription(self, 
                              transcription_id: str, 
                              timeout: int = 300,
                              poll_interval: int = 5) -> Dict[str, Any]:
        """
        Attend la fin d'une transcription
        
        Args:
            transcription_id: ID de la transcription
            timeout: Timeout en secondes
            poll_interval: Intervalle de vérification en secondes
            
        Returns:
            Résultat final de la transcription
        """
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            result = self.get_transcription_status(transcription_id)
            
            if result['status'] in ['completed', 'error']:
                return result
            
            time.sleep(poll_interval)
        
        raise TimeoutError(f"Transcription {transcription_id} timeout après {timeout}s")
    
    def translate(self, 
                  text: str, 
                  target_language: str,
                  source_language: Optional[str] = None) -> Dict[str, Any]:
        """
        Traduit un texte
        
        Args:
            text: Texte à traduire
            target_language: Langue cible
            source_language: Langue source (détection auto si non spécifié)
            
        Returns:
            Texte traduit
        """
        data = {
            "text": text,
            "target_language": target_language
        }
        
        if source_language:
            data["source_language"] = source_language
        
        response = self.session.post(
            f"{self.base_url}/translate",
            json=data
        )
        
        response.raise_for_status()
        return response.json()
    
    def summarize(self, 
                  text: str,
                  max_length: Optional[int] = None,
                  style: str = "bullet_points") -> Dict[str, Any]:
        """
        Génère un résumé du texte
        
        Args:
            text: Texte à résumer
            max_length: Longueur maximale du résumé
            style: Style du résumé (bullet_points, paragraph, abstract)
            
        Returns:
            Résumé généré
        """
        data = {
            "text": text,
            "style": style
        }
        
        if max_length:
            data["max_length"] = max_length
        
        response = self.session.post(
            f"{self.base_url}/summarize",
            json=data
        )
        
        response.raise_for_status()
        return response.json()
    
    def correct_text(self, 
                     text: str,
                     sector: str,
                     language: str = "fr") -> Dict[str, Any]:
        """
        Applique des corrections sectorielles au texte
        
        Args:
            text: Texte à corriger
            sector: Secteur (medical, legal, education, business)
            language: Langue du texte
            
        Returns:
            Texte corrigé avec suggestions
        """
        response = self.session.post(
            f"{self.base_url}/correct",
            json={
                "text": text,
                "sector": sector,
                "language": language
            }
        )
        
        response.raise_for_status()
        return response.json()
    
    def list_transcriptions(self, 
                           limit: int = 20,
                           offset: int = 0,
                           status: Optional[str] = None) -> Dict[str, Any]:
        """
        Liste les transcriptions
        
        Args:
            limit: Nombre maximum de résultats
            offset: Décalage pour pagination
            status: Filtrer par statut
            
        Returns:
            Liste des transcriptions
        """
        params = {
            "limit": limit,
            "offset": offset
        }
        
        if status:
            params["status"] = status
        
        response = self.session.get(
            f"{self.base_url}/transcriptions",
            params=params
        )
        
        response.raise_for_status()
        return response.json()
    
    def delete_transcription(self, transcription_id: str) -> bool:
        """
        Supprime une transcription
        
        Args:
            transcription_id: ID de la transcription
            
        Returns:
            True si suppression réussie
        """
        response = self.session.delete(
            f"{self.base_url}/transcriptions/{transcription_id}"
        )
        
        response.raise_for_status()
        return True
    
    def register_webhook(self, event: str, url: str) -> Dict[str, Any]:
        """
        Enregistre un webhook
        
        Args:
            event: Type d'événement (transcription.completed, etc.)
            url: URL du webhook
            
        Returns:
            Détails du webhook créé
        """
        response = self.session.post(
            f"{self.base_url}/webhooks",
            json={
                "event": event,
                "url": url
            }
        )
        
        response.raise_for_status()
        return response.json()
    
    def get_usage(self) -> Dict[str, Any]:
        """
        Obtient les statistiques d'utilisation
        
        Returns:
            Statistiques d'utilisation de l'API
        """
        response = self.session.get(f"{self.base_url}/usage")
        response.raise_for_status()
        return response.json()
    
    def export_to_format(self, 
                        transcription_id: str,
                        format: str = "srt") -> str:
        """
        Exporte une transcription dans un format spécifique
        
        Args:
            transcription_id: ID de la transcription
            format: Format d'export (srt, vtt, txt, json)
            
        Returns:
            Contenu exporté
        """
        response = self.session.get(
            f"{self.base_url}/transcriptions/{transcription_id}/export",
            params={"format": format}
        )
        
        response.raise_for_status()
        return response.text


# Exemple d'utilisation
if __name__ == "__main__":
    # Initialiser le SDK
    sdk = TraducXionSDK("your_api_key_here")
    
    # Transcrire un fichier
    result = sdk.transcribe(
        "audio.mp3",
        language="fr",
        sector="business",
        features={
            "diarization": True,
            "punctuation": True,
            "summary": True
        }
    )
    
    print(f"Transcription ID: {result['id']}")
    print(f"Texte: {result['text'][:200]}...")