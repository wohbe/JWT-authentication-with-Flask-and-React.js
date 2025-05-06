"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt

api = Blueprint('api', __name__)

CORS(api)
CHARACTER_ENCODING = 'utf-8'


@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409
    hashed_password = bcrypt.hashpw(password.encode(CHARACTER_ENCODING), bcrypt.gensalt())
    new_user = User(
        email=email,
        password=hashed_password.decode(CHARACTER_ENCODING),
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "message": "User registered succesfully",
        "user": email
    }), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not bcrypt.checkpw(password.encode(CHARACTER_ENCODING), user.password.encode(CHARACTER_ENCODING)):
        return jsonify({"error": "Invalid password"}), 401
    access_token = create_access_token(identity=email)
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": email
    }), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({
        "message": "Allowed to private route",
        "user": current_user
    }), 200
